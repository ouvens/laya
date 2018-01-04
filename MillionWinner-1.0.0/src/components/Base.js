
(function() {

    Laya.store = {};

    // CSS的key到LAYA key的映射
    var keyMap = {
        left: 'x',
        top: 'y',
        url: 'skin'
    };

    var cssTypeList = [
        Laya.Text,
        Laya.Label,
        Laya.Button,
        Laya.RadioGroup,
        Laya.CheckBox,
        Laya.Clip,
        Laya.Image,
        Laya.List,
        Laya.Image,
        Laya.ProgressBar,
        Laya.Tab,
        Laya.Input,
        Laya.TextArea,
        Laya.Dialog,
        Laya.ScrollBar,
        Laya.Slider,
        Laya.ComboBox,
        // Laya.ColorPicker,
        // Laya.Tree,
        ];

    // 默认扩展方法
    for (var i = 0, length = cssTypeList.length; i < length; i ++) {
        cssTypeList[i].prototype.css = _CSSRender;
        cssTypeList[i].prototype.setCss = _CSSUpdate;
        cssTypeList[i].prototype.remove = _CSSRemove;
        cssTypeList[i].prototype.append = _CSSAppend;
    }

    /**
     * 渲染样式
     * @param {any} styles 样式描述对象
     */
    function _CSSRender(styles) {
        var layaKey, layaValue;
        for (var key in styles) {
            // 优先获取Map中的key，否则使用默认的key，尽量和html的css一直
            layaKey = keyMap[key] || key;
            layaValue = styles[key];

            this[layaKey] = layaValue;
        }
    };

    /**
     * 渲染更新
     * @param {any} styles 样式描述对象
     */
    function _CSSUpdate(styles) {
        var layaKey, layaValue;
        for (var key in styles) {
            // 优先获取Map中的key，否则使用默认的key，尽量和html的css一直
            layaKey = keyMap[key] || key;
            layaValue = styles[key];
            this[layaKey] = layaValue;
        }
    };

    /**
     * 移除当前节点
     * 
     */
    function _CSSRemove() {
        this.removeSelf();
        this.css({
            display: 'none'
        })
    }

    /**
     * 
     * @param {any} child 
     */
    function _CSSAppend(child) {
        // 如果有参数，表示添加这个节点，否则表示添加当前节点
        if (child) {
            this.addChild(child);
        } else {
            Laya.stage.addChild(this);
        }
        this.css({
            display: 'block'
        })
    }
})()



/**
 * 入口：init -> componentInit -> componentWillMount -> render -> componentDidMount -> bindEvent
 * 入口：setState -> componentWillUpdate -> componentDidUpdate
 * 入口: remove
 */
var BaseComponent = (function(){

    /**基础UI组件类，所有UI组件从这里继承
     * @param {any} id 组件的唯一识别id
     */
    function BaseComponent(id) {
        var noop = function() {};

        // 全局保存组件到store中，便于使用Laya.store直接饮用
        if (id) {
            Laya.store[id] = this;
        }

        /**
         * 页面或组件初始化入口，用于外部直接调用
         * 
         */
        this.init = function() {
            this.C = {};  // 托管所有空间
            this.styles = {};  // 托管所用控件样式
            this.state = {}; // 托管所有的数据状态
            this._componentInit();
        }

        /**
         * 用于定义初始化内部组件
         */
        this._componentInit = function () {
            if (this.componentInit) {
                this.componentInit.call(this);
            }
            this._componentWillMount();
        }

        /**
         * 渲染前所做的准备工作
         */
        this._componentWillMount = function() {
            var self = this;
            var preloads = [];

            // 遍历分析收集skin并用于一起加载
            for(var key in this.styles) {
                skin = this.styles[key].skin;
                if (this.styles[key].skin) {
                    preloads.push(skin);
                }
            }

            Laya.loader.load(preloads, Laya.Handler.create(self, function() {
                // 默认生成渲染树
                for(var key in self.C) {
                    if (self.styles[key]) {
                        self.C[key].css(self.styles[key]);
                    }
                }
            }));

            // componentWillMount中的css设置优先级高于styles里面的
            if (this.componentWillMount) {
                this.componentWillMount.call(this);
            }
            this._render(this.C, this.styles);
        }

        /**
         * 渲染组件
         */
        this._render = function() {
            // 如果display为none，则默认不渲染节点
            for(var key in this.styles) {
                if (!this.C[key]) {
                    continue;
                }
                if (this.styles[key].display === 'none') {
                    this.C[key].removeSelf();
                } else {
                    this.C[key].append();
                }
            }

            // render中的渲染设置优先级高于styles里面的
            if (this.render) {
                this.render.call(this);
            }

            this._componentDidMount()
        }

        /**
         * 组件渲染完成
         * 
         */
        this._componentDidMount = function() {
            if (this.componentDidMount) {
                this.componentDidMount.call(this);
            }
            this._bindEvent();
        }

        /**
         * 绑定事件
         */
        this._bindEvent = function() {
            if (this.bindEvent) {
                this.bindEvent.call(this);
            }
        }


        /**
         * 设置状态
         * 
         */
        this.setState = function(nextState) {
            var oldStyles = this.styles;
            var newStyles;
            var diffStyles = {};
            var hasChanged = false;

            // 更新state
            for(var key in nextState) {
                this.state[key] = nextState[key];
            }

            newStyles = this.getStyles();
            this.styles = newStyles; // 更新styles

            // 计算diffView
            // 第一层查找
            for(var key in newStyles) {
                if(newStyles[key] != oldStyles);
                // 第二层查找，为了提升效率，一个组件内部最多支持两层对比，设计时也尽量安装两层来实现
                for(var subKey in newStyles[key]) {
                    if(newStyles[key][subKey] != oldStyles[key][subKey]) {
                        // 如果有变化，则生成diffStyles
                        diffStyles[key] = diffStyles[key] || {}
                        diffStyles[key][subKey] = newStyles[key][subKey];
                    }
                }
            }
            // 如果diffStyles不为空才说明有差异
            for(var key in diffStyles) {
                hasChanged = true;
            }
            // 如果有改变才去更新
            if (hasChanged) {
                this._componentWillUpdate(diffStyles);
            }
        }

        /**
         * 组件将要更新
         * 
         * @param {any} nextStyles 
         */
        this._componentWillUpdate = function(nextStyles) {
            var self = this;
            var preloads = [];

            // 遍历分析收集skin并用于一起加载
            for(var key in nextStyles) {
                skin = nextStyles[key].skin;
                if (nextStyles[key].skin) {
                    preloads.push(skin);
                }
            }

            Laya.loader.load(preloads, Laya.Handler.create(self, function() {
                // 默认生成渲染树
                for(var key in self.C) {
                    if (nextStyles[key]) {
                        self.C[key].css(nextStyles[key]);
                    }
                }
            }));

            if (this.componentWillUpdate) {
                this.componentWillUpdate.call(this);
            }
            this._Update(self.C, nextStyles);
        }

        /**
         * 渲染组件
         */
        this._Update = function(C, nextStyles) {
            // 如果display为none，则默认不渲染节点
            for(var key in nextStyles) {
                if (nextStyles[key].display === 'none') {
                    C[key].removeSelf();
                } else {
                    C[key].append();
                }
            }

            this._componentDidUpdate()
        }
        /**
         * 组件更新完成
         * 
         */
        this._componentDidUpdate = function() {
            if (this.componentDidUpdate) {
                this.componentDidUpdate.call(this);
            }
        }

        /**
         * 删除当前component下的所有节点
         * 
         */
        this.remove = function() {
            // 如果display为none，则默认不渲染节点
            for(var key in this.C) {
                this.C[key].removeSelf();
            }
        }
    }

    /**
     * 扩展继承方法
     * 
     * @param {any} object 
     * @returns 
     */
    BaseComponent.prototype.extend = function(object) {
        for (var key in object) {
            this[key] = object[key];
        }
        return this;
    }

    return BaseComponent;
})()