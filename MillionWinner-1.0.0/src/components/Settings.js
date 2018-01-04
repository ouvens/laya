
// 系统菜单页面
var Settings = (function() {
    var Text = Laya.Text;
    var Button = Laya.Button;
    var Event = Laya.Event;
    var Image = Laya.Image;
    var Component = BaseComponent;

    var component = new Component('#sys-menu');

    var Settings = component.extend({

        /**
         * 声明组件内部控件和样式
         * 
         */
        componentInit: function() {
            var self = this;
    
            this.state = {
                showBoy2: false,
                showBoy1: true
            };

            // 变量映射类型
            this.C = {
                bg: new Image(),
                txt: new Text(),
                boy1: new Image(),
                boy2: new Image(),
                startBtn: new Button()
            };
            
            /**
             * 或者style只能这样设置，因为需要活动动态的结果
             * 
             * @returns 
             */
            this.getStyles = function(){
                // 类似模板描述
                return {
                    bg: {
                        skin: 'res/img/1.png',
                        width: Laya.stage.width,
                        height: Laya.stage.height
                    },

                    boy1: {
                        skin: 'res/img/charater.png',
                        top: 0,
                        right: 0,
                        display: self.state.showBoy1 ? 'block': 'none'
                    },
                    boy2: {
                        skin: 'res/img/charater.png',
                        bottom: 0,
                        left: 0,
                        display: self.state.showBoy2 ? 'block' : 'none'
                    },
                    startBtn: {
                        skin: 'res/img/ok.png',
                        height: 60,
                        width: 160,
                        left: Laya.stage.width / 2 - 80,
                        top: Laya.stage.height / 2 - 150
                    }
                }
            };

            this.styles = this.getStyles();
        },

        /**
         * 特殊的渲染操作
         * 
         */
        render: function() {

        },

        /**
         * 事件绑定
         * 
         */
        bindEvent: function() {
            var self = this;
            var states = this.state;
            
            this.C.startBtn.on("click", this, function(){
                // 更新CSS
                self.setState({
                    showBoy2: !states.showBoy2,
                    showBoy1: !states.showBoy1
                })
            });

            this.C.boy1.on("click", this, function(e){
                //点击后小人会放大缩小
                var boy = e.target;
                console.log(boy)
            });

            this.C.boy2.on("click", this, function(){
                //输出当前适配模式下的stage大小
                console.log("size:", Laya.stage.width, Laya.stage.height);
            });
        }
    });

    return Settings;
})();