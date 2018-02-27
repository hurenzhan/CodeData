import $ from 'jquery';

class Base {
	initPlayList() {	//初始化奖金和玩法说明
		this.play.list.set('r2',{
			bonus: 6,
			tip: '从01～11中任选2个或多个号码，所选号与开奖号码任意两个号码相同，即中奖<em class="red">6</em>元',
			name: '任二'
		})
		.set('r3',{
			bonus: 19,
			tip: '从01～11中任选3个或多个号码，所选号与开奖号码任意三个号码相同，即中奖<em class="red">19</em>元',
			name: '任三'
		})
		.set('r4',{
			bonus: 78,
			tip: '从01～11中任选4个或多个号码，所选号与开奖号码任意四个号码相同，即中奖<em class="red">78</em>元',
			name: '任四'
		})
		.set('r5',{
			bonus: 540,
			tip: '从01～11中任选5个或多个号码，所选号与开奖号码相同，即中奖<em class="red">540</em>元',
			name: '任五'
		})
		.set('r6',{
			bonus: 90,
			tip: '从01～11中任选6个或多个号码，所选号与开奖号码任意五个号码相同，即中奖<em class="red">90</em>元',
			name: '任六'
		})
		.set('r7',{
			bonus: 26,
			tip: '从01～11中任选7个或多个号码，所选号与开奖号码任意五个号码相同，即中奖<em class="red">26</em>元',
			name: '任七'
		})
		.set('r8',{
			bonus: 9,
			tip: '从01～11中任选8个或多个号码，所选号与开奖号码任意五个号码相同，即中奖<em class="red">9</em>元',
			name: '任八'
		})
	}
	initNumber() {	//初始化号码
		for (let i=1;i<12;i++) {	//号码处理
			this.number.add((''+1).padStart(2,'0'));
		}
	}
	setOmit(omit) {    //设置遗漏数据
		let self = this;
		self.omit.clear();
		for (let [index,item] of omit.entries()) {
			self.omit.set(index,item);
		}
		$(self.omit_el).each(function(index,item) {
			$(item).text(self.omit.get(index));
		})
	}
	setOpenCode() {    //设置开奖
		let self = this;
		self.open_code.clear();
		for (let item of code.values()) {
			self.open_code.add(item);
		}
		self.updateOpenCode && self.updateOpenCode.call(self,code);
	}
	toggleCodeActive(e) {	//号码选中
		let self = this;
		let $cur = $(e.currentTarget);
		$cur.toggleClass('btn-ball-active');
		self.getCount();
	}
	changePlayNav(e) {	//切换玩法
		let self = this;
		let $cur = $(e.currentTarget);
		$cur.addClass('active').siblings().removeClass('active')
		self.cur_play = $cur.attr('desc').toLocaleLowerCase(); 
		$('#zx_sm span').html(self.play_list.get(self.cur_play).tip);
		$('.boll-list .btn-boll').removeClass('btn-ball-active');
		self.getCount();
	}
	assistHandle(e) {	//操作区
		e.preventDefault();
		let self = this;
		let $cur = 	$(e.currentTarget);
		let index = $cur.index();
		$('.boll-list .btn-boll').removeClass('btn-boll-active');
		if (index === 0) {
			$('.boll-list .btn-boll').addClass('btn-boll-active');
		}
		if (index === 1) {
			$('.boll-list .btn-boll').each(function(i,t){
				if (t.textContent-5 > 0) {
					$(t).addClass('btn-boll-active')
				}
			});
		}
		if (index === 2) {
			$('.boll-list .btn-boll').each(function(i,t){
				if (t.textContent-6 < 0) {
					$(t).addClass('btn-boll-active')
				}
			});
		}
		if (index === 3) {
			$('.boll-list .btn-boll').each(function(i,t){
				if (t.textContent%2 == 1) {
					$(t).addClass('btn-boll-active')
				}
			});
		}
		if (index === 4) {
			$('.boll-list .btn-boll').each(function(i,t){
				if (t.textContent%2 == 0) {
					$(t).addClass('btn-boll-active')
				}
			});
		}
		self.getCount()
	}
	getName() {
		return this.name
	}
	addCode() {
		let = self = this;
		let $active = $('.boll-list .btn-boll-active').text().match(/\d{2}/g);
		let active = $active?$active.length:0
		let count = self.computeCount(active,self.cur_play);
		if (count) {
			self.addCodeItem($active.join(''),self.cur_play,self.play_list.get(self.cur_play).name,count);
		}
	}
	addCodeItem(code,type,typeName,count) {    //添加单次号码
		let self = this;
		const tpl = `
		<li codes="${type}|${code}" bonus="${count*2}" count="${count}">
			<div class="code">
				<b>${typeName}${count>1?'复式':'单式'}</b>
				<b class="em">${code}</b>
				[${count}注,<em class="code-list-money">${count*2}</em>元]
			</div>
		</li>
		`;
		$(self.cart_el).append(tpl);
		self.getTotal();
	}
}
