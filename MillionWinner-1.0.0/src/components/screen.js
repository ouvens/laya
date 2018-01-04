(function() {
	var WebGL  = Laya.WebGL;
	var Image = Laya.Image;
	var Stat    = Laya.Stat;

	// 不支持WebGL时自动切换至Canvas
	Laya.init(375, 667, WebGL);

	//设置适配模式
	Laya.stage.scaleMode = Laya.Stage.SCALE_NOSCALE;
	//设置横竖屏
	//设置水平对齐
	Laya.stage.alignH = 'center';
	//设置垂直对齐
	Laya.stage.alignV = 'middle';

	// 设置底层基础样式
	Laya.stage.bgColor = '#cccccc';

	var backgroundImage = new Image();

	backgroundImage.css({
		skin: 'res/img/1.png',
		width: Laya.stage.width,
		height: Laya.stage.height
	});

	Laya.stage.addChild(backgroundImage);

	// 显示帧率性能数据
	Stat.show(0, 0);

	SysMenu.init();
})();