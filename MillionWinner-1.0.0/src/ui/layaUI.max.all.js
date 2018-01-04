var CLASS$=Laya.class;
var STATICATTR$=Laya.static;
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var SysMenuUI=(function(_super){
		function SysMenuUI(){
			

			SysMenuUI.__super.call(this);
		}

		CLASS$(SysMenuUI,'ui.scence.SysMenuUI',_super);
		var __proto__=SysMenuUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(SysMenuUI.uiView);

		}

		SysMenuUI.uiView={"type":"View","props":{"x":0,"width":300,"height":400}};
		return SysMenuUI;
	})(View);