<template>
  <div class="textbook-page">
    <div class="textbook-page-book">
      <div class="textbook-page-book-left">
        <product-zoom :imageUrl="currentImg"></product-zoom>
        <div class="textbook-page-book-left-images">
          <img v-for="(i,index) in books" :key="index" class="textbook-page-book-left-images-img" :src="i.imgUrl" alt="" @click="selectImg(i)">
        </div>
      </div>
      <div class="textbook-page-book-right">
        <h3 class="textbook-page-book-right-title">Paracraft编程入门</h3>
        <p class="textbook-page-book-right-hint">成为3D动画与编程能手</p>
        <p class="textbook-page-book-right-suggest">学生、家长教师的AI与编程入门教材，适合7岁以上用户使用</p>
        <div class="textbook-page-book-right-text">
          <div class="textbook-page-book-right-text-label">作者：</div>
          <div class="textbook-page-book-right-text-content">李西峙</div>
        </div>
        <div class="textbook-page-book-right-text">
          <div class="textbook-page-book-right-text-label">出版日期：</div>
          <div class="textbook-page-book-right-text-content">2019-09-12</div>
        </div>
        <div class="textbook-page-book-right-text">
          <div class="textbook-page-book-right-text-label">页数：</div>
          <div class="textbook-page-book-right-text-content">301（彩色印刷）</div>
        </div>
        <div class="textbook-page-book-right-text">
          <div class="textbook-page-book-right-text-label">说明：</div>
          <div class="textbook-page-book-right-text-content">目前图书还没有正式出版，发给您的版本为彩色印刷内部版，印刷质量可能没有正式版好，但我们会赠送您价值500元的在线课程包激活码。</div>
        </div>
        <div class="textbook-page-book-right-price">
          <span class="textbook-page-book-right-price-icon">￥</span>
          <span class="textbook-page-book-right-price-count">96</span>
          <span class="textbook-page-book-right-price-purchase" @click="goPurchase('https://item.taobao.com/item.htm?spm=a1z10.1-c-s.w4004-21675647078.2.40326b5eXGKqAM&id=594558350038')">购买</span>
        </div>
      </div>
    </div>
    <div class="textbook-page-foreword">
      <h3 class="textbook-page-foreword-title">前言</h3>
      <div class="textbook-page-foreword-intro">
        <p class="textbook-page-foreword-intro-text">"编程一直被误解为一件很难的事情。一个原因是几乎所有编程语言（工具，文档，开发者社区）都是英语文化圈下的产物，如果你英语不好，就无法真正融入其中。另一个原因是编程语言没有被教育者真正当成一种人类的语言去对待。</p>
        <p class="textbook-page-foreword-intro-text">本书希望能够作为编程的入门教材，将正确的工具，学习方法介绍给希望真正掌握编程的你。本书的目标是通过我们原创的Paracraft工具，让你可以随心所欲的创作出任意复杂的3D动画与游戏。当你具备这种入门能力时，你仍然可以继续使用Paracraft开发专业的计算机软件或自学任何其它语言。学习编程和学习外语很像，需要大量的打字练习。动手打字就如同学习外语中的发音一样重要。回忆一下，从出生开始，我们就在学习母语的发音，然后我们每天还要去使用它，长大后又系统的学习它。一个4岁的小孩已经能够用母语的发音表达自己的任何想法。相似的，本书希望营造一个类似的学习环境，让你可以在计算机世界中表达自己的任何想法。这也是当代希望从事科学与创造性工作的人的一项必备技能。拥有编程的入门能力并不困难，但也需要4年的时间或打5000行以上的代码。</p>
        <p class="textbook-page-foreword-intro-text">1989年，7岁的我照着一本我父亲给我的书编写了我人生中第一个程序，并从此喜欢上了编程，小学期间我完成了大量个人作品，到了随心所欲的入门状态，这要感谢我的老师。本书也希望和大家分享我的学习经历。</p>
        <p class="textbook-page-foreword-intro-name">李西峙</p>
        <p class="textbook-page-foreword-intro-time">2018.2.5</p>
        <p class="textbook-page-foreword-intro-time">创作于深圳大富配天集团NPL语言研发中心</p>
        <p class="textbook-page-foreword-intro-address">lixizhi@paraengine.com</p>
        <p class="textbook-page-foreword-intro-address">https://keepwork.com/</p>
        <div class="textbook-page-foreword-long-words" v-if="showMoreInfo">
          <p class="textbook-page-foreword-intro-text">
            作者简介<br>
            李西峙：1982年出生于哈尔滨。2005年毕业于浙江大学计算机系（竺可桢学院）。大学期间他在国内外会议和刊物上
            发表游戏引擎，脚本语言技术，三维动画制作，CPU芯片设计相关论文和著作8篇。2004年出于长期对人工智能的兴趣
            和研究，他创立了NPL语言（Neural Parallel Language）和ParaEngine 3D游戏引擎，至今写了过百万的开源代码和
            各种开发工具。Paracraft也是基于NPL语言开发的一款3D创作工具。2007-2015年，他先后获得著名风险投资IDG和国
            内著名企业家的投资，并任CEO。<br>
            李铁才：1950年出生于上海，是我的父亲，《相似性和相似原理》作者。哈尔滨工业大学及深圳研究生院双基地教
            授，博士生导师，深圳航天科技创新研究院科技委主任。1996年获航天突出贡献专家称号；1997年获国家特殊津贴；
            获国家、省、部级科技成果奖18次；获中国发明专利30项，获美国发明专利3项；在国内外发表论文50余篇。历时30
            年致力于相似性原理及其应用技术的研究。编写了本书第5章 相似原理与人脑仿真。<br>
            创作本书时还有一个备选副标题：相似原理入门教程。相似性和相似原理是驱动人类大脑的基本工作原理，
            Paracraft也可以看成是使用相似原理进行创作的一个工具。我们会尽量将相似原理的思想融入到本书中，让你
            在学会编程的同时对人脑和宇宙万物的工作方式有一定的认知。程序员是虚拟世界的造物主，而虚拟世界与现
            实世界和人类大脑必然有相似之处。<br>
            https://keepwork.com<br>
            本书的一些章节是由我的团队合作完成的，他们是：<br>
            刘远亮：电梯调度算法，3D世界的编程模型，编程中的建模过程：乒乓球小游戏，编程中的建模过程：迷宫小游
            戏，编程中的建模过程：钢琴，编程中的建模过程：飞行的小鸟，编程中的建模过程：坦克大战，编程中的建模
            过程：跳一跳，由电梯调度算法了解编程思维，生命游戏，复杂编程中的建模过程：生命游戏的制作，BlockBot
            小游戏介绍，复杂编程中的建模过程：BlockBot核心部分的制作，BlockBot小游戏–3D UI，BlockBot小游戏–
            2D UI，BlockBot小游戏–复杂UI设计，人力资源游戏，如何学习Paracraft编程。<br>
            张大伟：复杂编程中的建模过程：BlockBot核心部分的制作，BlockBot小游戏–3D UI，BlockBot小游戏–2D
            UI，BlockBot小游戏–复杂UI设计。<br>
            陈清华：计算机体系结构，台式计算机模拟，狗狗陪护机器人模拟。<br>
            张磊：CAD建模“桌子”，CAD建模“空心的盒子”，CAD建模“奥运五环”，CAD建模“杯子”，CAD建模“掷骰
            子游戏”。<br>
            罗阳平：制作个人网站，创建课程包。<br>
            谭雯文：创建方块，批量操作，电影方块，演员和动画，夏天游泳，制作简易动画开头，BMAX模型，简易BMAX小
            吉他，简易BMAX小动画，四足动物与镜头震动效果，密室教学，密室开头设计，星球运动仿真教学，BMAX简易骨
            骼与X文件应用，传送石，电影地震镜头与人物表现，电影方块与过山车，子母电影方块。 如何学习编程
            在深圳大富配天集团NPL语言研发中心，我们每周六都有一个3小时的免费的Paracraft编程导引课，参加的人主要是
            小学生，偶尔还有家长和大学老师，总共已经30多次了。<br>
            来的大人们经常会问我：“应该如何学习编程？”；而小孩们总是迫不及待的运行电脑上的Paracraft，自己探索起
            来。<br>
            学习编程很简单。首先，你需要买一台带键盘的PC机或笔记本电脑。编程是需要打字的，因此需要鼠标和键盘。遗憾
            的是我发现50%的普通家庭只有手机，PAD或者15年前无法开机的电脑。如果你已经有最新的笔记本电脑，可以再购买
            一个更大的显示器和独立的鼠标键盘，就可以将笔记本改造成台式机。<br>
            其次，你要学会在电脑上安装一个能编程的软件，本书的读者需要安装Paracraft（后面会教你）。
            最后，你要允许自己的小孩儿使用电脑，哪怕是玩游戏。99%的家庭之前都做不到这三点，因此虽然大多数学校都开
            设了编程课，孩子也不可能学会编程。当你在家中做到这3点时，你会发现很多孩子是天生的程序员。孩子们会逐渐
            远离手机，更愿意将时间花在大屏幕上，去探索别人的作品或自我创作。这就好比孩子都喜欢模仿大人的语言和行
            为，当你给它一大堆积木，他们会先破坏再搭建。<br>
            如果你的孩子已经是一个手机游戏高手，那么不妨让他到电脑上玩Paracraft。Paracraft中有大量其它孩子，老师，
            程序员创建的3D游戏和动画作品，每个作品都可以随时查看背后的逻辑与代码，别人的作品就是最好的老师。
            学习计算机语言和学习其它自然语言，如中文和英文，是一样的，你要不停的使用它，创造出自己的作品。
            其实人类学习任何技能都是一样的，因为教育的本质就是让人保持思考和一直有事可做。<br>
            因此，我们还为Paracraft开发了一个学习平台，叫做KeepWork，官网是：https://keepwork.com<br>
            KeepWork有2个字面意思：<br>
            保持(keep)有事可做(work)：人不能放弃工作和创作，大人小孩都一样。这个是教育的本质。<br>
            保存(keep)作品(work)：我们保存了你的所有作品和更改历史。作品是未来教育的重要评估方式，不再需要考试
            的分数。<br>
            只要你安装了Paracraft，后面的一切就可以教给孩子自己去探索、学习和创造了。而你只需要观察孩子是否一直保
            持有事可做即可。本书其实是Keepwork上内容的一个浓缩，启发孩子去探索和创作超过50个项目。出书的原因是为了
            让成年人也能快速和系统的了解Paracraft和编程理论，方便教育机构的教学，以及保护孩子的视力。但是真正入门
            编程，仍然需要大量在计算机上的打字练习和项目实践。 本书有什么
            本书分为上，中，下三部：
            上部：50个编程项目
            通过思维实验解决问题, 理解AI和体验编程
            中部：编程理论
            系统的讲解变量，函数等重要编程概念
            下部：参考手册
            本书中所有的编程词汇，都可以查询
            这三部分内容分别代表了程序员的3类重要行为：搜索项目、学习理论和寻找文档。下面来说说这3类行为:
            i.搜索项目：程序员在解决一个问题时，通常会先去搜索别人的开源项目来参考。新人学习编程也是从项目开
            始的，而不是理论或语法。因此上部我们将大量的编程项目按照一定的次序归类到了几个章节中。你可以根
            据自己的能力和喜好从任何一个开始做起。这些项目大多来自我们过去每周六的编程导引课，因此都可以在
            2个小时内完成。<br>
            ii. 学习理论：计算机程序已经深入到了人类科技的每个角落：物理，化学，生物，航天，材料，数学，动画，
            游戏等等。每个领域的程序员都需要学习对应的理论知识，然后用程序创造出符合相似规律的虚拟事物来。
            在本书的中部，我们会系统的讲解计算机编程的通用理论，这些理论和电子计算机的工作原理相关，因此几
            乎适用于所有现代计算机语言。而关于通用理论之外的理论，我们放在第一部分的每个项目中讲解。<br>
            iii. 寻找文档：一般计算机语言的全部内置语法和词汇只有不到20个。因此对于已经精通一门语言的程序员，学
            习一个新的计算机语言大概只需1小时。但是编程是一个不断创造新词汇（函数）的过程，我们在编程时需
            要去使用其它程序员创造的词汇，这个词汇的数量从几百到上千，甚至几十万，每个领域都有自己的词汇，
            每个项目也有自己的词汇。程序员会给这些新词汇写使用说明书，我们叫做文档，由于文档数量太多，即使
            是资深程序员也只能靠模糊查询，而不是精确记忆。我们每写一行代码都可能需要先查看文档。在本书的下
            部中，我们列出了在上部的项目中使用到的所有词汇的文档。这些词汇已经足够开发任何你能想到的动画和
            游戏。<br>
            如何使用本书<br>
            对于自学者，我们希望用户从本书上部的任何一个项目开始学习编程。然后遇到任何不懂的地方可以在中部和下部中
            找答案。但是请你不要去记忆任何下部中的内容，只要有一个模糊的印象即可。即使是像我这样有30年编程经验的程
            序员，也经常在这3种行为之间切换，只不过专业程序员不会看书，而是从互联网中通过搜索去获取这些内容。因此
            初学者可以先使用本书，然后逐渐脱离本书，直接到Keepwork网站或Paracraft软件中找答案。<br>
            本书也可作为编程教材，上部的每个项目都可以作为一个2小时的编程课。我们为每个项目制作了在线课程，目录中
            的项目ID为在线课程ID，方便老师在课堂教学，详见第一章的开始部分。老师可以根据课时数，按照任意自己喜欢的
            顺序和学生的能力选择课程项目，我们的网站上给出了几种参考性的教学计划。<br>
            本书的中部（理论部分）不建议在课堂上教学，但是老师可以安排一些答疑课，或者每节课留一些时间给学生提问。
            计算机语言中需要解释的知识点不到20个，更多的是需要大量实践。课堂上的教学：应以完成项目制作为目标，而
            非彻底理解里面的所有细节 ，鼓励学生间相互帮助。而贯穿整个学期的教学的大目标应该是引导学生用课余时间完
            成自己的计算机项目 。我们建议老师在每节课开始或结束的时候，用5分钟的时间请班级中的学生展示一下自己在课
            余时间完成的作品，如果还没有这样的作品，可以使用我们网站上的学生作品视频。我们的网站上每月都举办编程大
            赛，里面有大量学生作品。<br>
            当学生开始创作自己的作品时，有能力的老师应该定期去阅读学生的作品代码，并给出修改意见。这就如同语文老师
            要批改学生的作文一样。这对老师的编码水平有一定的要求，但是如果学生将作品分享到KeepWork， 其他高水平的
            用户就可以提供这种帮助或服务。<br>
            在第6章 中，我们给出了如何以本书为起点，构建从小学1年级到大学的编程学习体系。本书的
            具体的讲解了如何开展Paracraft编程教学。<br>
            谁该阅读本书<br>
            具有阅读能力的人都可以阅读本书，本书争取只使用不超过20个专业术语（见附录3）去讲解计算机编程。 在我小学
            时，经常读一些大人门的科普书籍，总能有读懂的部分，也鼓励我去搞清楚看不懂的部分。哪怕是最高深的理论都应
            该能在生活中找到相似的比喻，如果找不到，很可能是这个理论本身有问题。<br>
            我心目中的读者包括：<br>
            喜欢编程的小朋友：尽力去理解本书，但你不需要全部看懂，甚至开始你只需将本书看成50个编程实验的绘本，
            但需要你亲自动手去体验代码和计算机的创造力。<br>
            家长：我理解大人们学习编程已经没有小孩儿那样容易了，因为你可能没有时间和兴趣去动手写代码，但是至少
            你可以快速的阅读本书，回答一些小孩儿提出的问题。<br>
            老师：我鼓励所有年轻教师，无论你是教什么学科的，都能像小朋友一样去动手学习计算机编程，达到可以随心
            所欲的入门程度。当你掌握了Paracraft，你就打开了一扇门，你能创造的将不只是PPT（文字和图片），而是动
            画，逻辑与交互。未来教育需要大量教育工作者的创造；项目式和交互式学习将取代45分钟的课堂学习。在我们
            的官网（keepwork.com)我们为老师提供了创建项目式课程学习的编辑工具，本书中所有的项目已经被其它老师
            做成了交互式在线课程。我们期待更多，各个领域的教育工作者加入我们，用计算机技术改变未来的教育。我们
            为教育工作者提供培训。<br>
            程序员：Paracraft是一个开源的软件生态，我们期待你的加盟，一起开发面向人工智能和未来教育的新应用。
            有经验的程序员也许也能从本书中获得一些编程方面的启发。如果你既是程序员又是一位家长，Paracraft是你
            最好的亲子读物了，你应该和孩子一起完成一个个项目并通过我们的官网分享出来。<br>
            大学生和大学老师：Paracraft在过去几年中有很多作品，课程，CAD工业设计，书籍等都是由大学老师或大学生
            完成的，希望更多的大学生和老师选择Paracraft作为毕业设计的工具或题目。我们的官网还提供了人人可为老
            师的教学机制，希望大学生可以教小学生，并一同完成项目和学习编程：当别人的老师是最好的学习方式。<br>
            站在前人的肩膀上<br>
            Paracraft是使用NPL语言开发的。从2004年创立NPL计算机语言，到2005年制作ParaEngine分布式游戏引擎，到2007
            年发布儿童动漫创作平台，到2009年发行魔法哈奇3D创想乐园，到2012年发布Paracraft创作工具，到2015年NPL语言
            开源，到2018年发布Keepwork。期间我吸收了很多前人的思想和成果。<br>
            我无法罗列全部，但是最重要的思想是我父亲的《相似性和相似原理》，初稿是写于1982年，2015年后我也加入了该
            书的修改和补充工作。其中包含了对多组时空序列及其相似性的数学表达与大量研究案例。宇宙内部的相似性从易经
            开始，到亚里士多德，到后来，它已经被无数科学家研究过。可能是它太普遍，导致我们在使用它时，忽略了它的存
            在。在人工智能时代，我们有必要将它系统的作为一门独立的理论去研究。人类的大脑由记忆与单向连接构成。记忆
            就是时间序列，或者说是动画，我们很难去修改自己的某个记忆，但是我们可主观的选择一段记忆的时间起点在大脑
            中播放。<br>
            NPL语言的基础语法是基于Lua的, 后来又受到Lisp语言的影响，使得它支持动态语法扩展。Lua的语法是全世界公认
            最简洁的。它被无数高级脚本语言采用作为基础语法；同时它拥有全世界最快的动态编译器Luajit，使得我们可以用
            C/C++去扩充它。<br>
            在本书中，第一步：我们要教会你如何随心所欲的创建任意复杂的三维时空序列，也就是动画。我们的网上有成千上
            万的小朋友自己创建的Paracraft动画片或电影供你学习和参考。第二步：我们要教会你如何用代码去控制这些动画
            的播放起点，你就像一个导演或音乐指挥家一样让你的动画在你代码的指挥下播放。当你可以随心所欲的掌握这2个
            技能时，你发现你已经可以像控制自己的思想和梦境一样去控制数字世界中的一切。<br>
            2007年和2009年当我用这种思想创建儿童动漫创作平台（KidsMovieCreator）和魔法哈奇时，还不知道后来风靡全球
            的一款游戏叫Minecraft。当我2012年深入研究它时，才发现它的魅力。但我是从相似原理的角度来看它的，在时空
            序列的数学表达中，世界应该是粒子化的，而且应该是其大无内，其小无外的。Paracraft将这种粒子化建模的思想
            发挥到了极致，用于任意的动画创作和编程。<br>
            MIT实验室的Scratch对少儿编程的贡献是巨大的，它让更低年龄层的用户可以自学编程。Paracraft后来也引入了类
            似Scratch的积木式编程，并且我们让它可以控制3D世界中的角色，并可以平滑的过渡到基于文本的编程。我们还提
            出并实现了一种面向记忆的编程模式。<br>
            无法罗列全部前人的成果，所以我们从最开始就在Github上开源了我们的所有成果，包括NPL语言和Paracraft。至今
            有上百位开发者参与其中，我们希望更多的程序员和教育工作者可以在我们的研究成果上继续探索。 致谢
            感谢家人<br>
            感谢老师<br>
            感谢Paracraft的用户，尤其是奇仔，桃子，无心，阿杰。是你们的辛勤付出让我们的工具可以大放异彩。<br>
            感谢魔法哈奇超过500万注册用户近10年来的陪伴，很多用户从小学升到了大学，仍然没有完全离开这款3D社区和
            Paracraft。<br>
            感谢我过去和现在的团队，未来我们还有很长的道路要走。很多中途离开的同事依然在远程参与我们的开源社区。
            感谢合作伙伴与多位教育工作者愿意在我们还不完善时，坚持使用我们的产品。<br>
            感谢资方，在最艰难的时刻依然给我们无私的赞助，能够让我们去实现一个10年以上的长期规划。<br>
          </p>
        </div>
        <div class="textbook-page-foreword-intro-more" @click="viewMoreInfo">{{showMoreInfo ? '收起':'阅读更多'}}</div>
      </div>
    </div>
    <div class="textbook-page-information">
      <div class="textbook-page-information-box">
        <h3 class="textbook-page-information-box-title">相关视频</h3>
        <div class="textbook-page-information-box-cover">
          <div class="textbook-page-information-box-cover-img">
            <img class="textbook-page-information-box-cover-img-image" src="@/assets/org/Paracraft创意空间安装与基础教学.png" alt="" @click="goPurchase('https://v.qq.com/x/page/d08632md4lo.html')">
            <p class="textbook-page-information-box-cover-img-title" @click="goPurchase('https://v.qq.com/x/page/d08632md4lo.html')">Paracraft创意空间安装与基础教学</p>
          </div>
          <div class="textbook-page-information-box-cover-img">
            <img class="textbook-page-information-box-cover-img-image" src="@/assets/org/Paracraft创意空间安装与基础教学.png" alt="" @click="goPurchase('https://api.keepwork.com/storage/v0/siteFiles/770/raw#宣传视频01.mp4')">
            <p class="textbook-page-information-box-cover-img-title" @click="goPurchase('https://api.keepwork.com/storage/v0/siteFiles/770/raw#宣传视频01.mp4')">Paracraft</p>
          </div>
        </div>
      </div>
      <div class="textbook-page-information-box">
        <h3 class="textbook-page-information-box-title">相关书籍</h3>
        <div class="textbook-page-information-box-cover">
          <div class="textbook-page-information-box-cover-img">
            <img class="textbook-page-information-box-cover-img-image" src="@/assets/org/Paracraft创意空间入门.png" alt="" @mouseover="showPurchaseDialog(1)">
            <p class="textbook-page-information-box-cover-img-title" @mouseover="showPurchaseDialog(1)">Paracraft创意空间入门</p>
          </div>
          <div class="textbook-page-information-box-cover-img">
            <img class="textbook-page-information-box-cover-img-image" src="@/assets/org/相似性与相似原理.png" alt="" @mouseover="showPurchaseDialog(2)">
            <p class="textbook-page-information-box-cover-img-title" @mouseover="showPurchaseDialog(2)">相似性与相似原理</p>
          </div>
        </div>
      </div>
    </div>
    <div class="textbook-page-teachers">
      <div class="textbook-page-teachers-desc">
        <h4 class="textbook-page-teachers-desc-title">Paracraft编程入门</h4>
        <p class="textbook-page-teachers-desc-subtitle">成为3d动画与编程能手</p>
        <span class="textbook-page-teachers-desc-rectangle"></span>
        <p class="textbook-page-teachers-desc-text">学生、家长、教师的AI与编程入门教材，适合7岁以上用户使用。<br>
          学习《paracraft编程入门》，用编程创造世界。</p>
        <span class="textbook-page-teachers-desc-more" @click="goPurchase('https://item.taobao.com/item.htm?spm=a1z10.1-c-s.w4004-21675647078.2.40326b5eXGKqAM&id=594558350038')">马上订购</span>
      </div>
    </div>
    <el-dialog class="purchase-dialog" title="购买页面" :visible.sync="isShowPurchase" width="520px" center>
      <div class="purchase-dialog-book">
        <div class="purchase-dialog-book-cover">
          <img :src="purchaseMethodsImages" alt="">
        </div>
        <div class="purchase-dialog-book-info">
          <h5 class="purchase-dialog-book-info-name">{{purchaseMethodsImagesBookName}}</h5>
          <p class="purchase-dialog-book-info-author">{{purchaseMethodsImagesBookAuthor}}</p>
        </div>
      </div>
      <div class="purchase-dialog-methods">
        <a v-for="(i,index) in purchaseMethods" :key="index" class="purchase-dialog-methods-method" :href="i.purchaseUrl" target="_blank">{{i.label}}</a>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ProductZoom from './common/ProductZoom'
export default {
  name: 'Textbook',
  data() {
    return {
      books: [
        {
          imgUrl: require('@/assets/org/book2.png')
        },
        {
          imgUrl: require('@/assets/org/1.png')
        },
        {
          imgUrl: require('@/assets/org/2.png')
        },
        {
          imgUrl: require('@/assets/org/3.png')
        }
      ],
      isShowPurchase: false,
      purchaseMethodsImages: '',
      purchaseMethodsImagesBookName: '',
      purchaseMethodsImagesBookAuthor: '',
      purchaseMethods: [],
      currentImg: require('@/assets/org/book2.png'),
      showMoreInfo: false
    }
  },
  components: {
    ProductZoom
  },
  methods: {
    goPurchase(url) {
      window.open(url)
    },
    showPurchaseDialog(index) {
      switch (index) {
        case 1:
          ;(this.purchaseMethodsImages = require('@/assets/org/Paracraft创意空间入门.png')),
            (this.purchaseMethodsImagesBookName = 'Paracaraft创意空间入门'),
            (this.purchaseMethodsImagesBookAuthor =
              '作者：于平、李玉霞、鞠慧敏'),
            (this.purchaseMethods = [
              {
                label: '去京东购买',
                purchaseUrl:
                  'https://search.jd.com/Search?keyword=Paracraft%E5%88%9B%E6%84%8F%E5%8A%A8%E7%94%BB%E5%85%A5%E9%97%A8&enc=utf-8&wq=Paracraft%E5%88%9B%E6%84%8F%E5%8A%A8%E7%94%BB%E5%85%A5%E9%97%A8&pvid=9e8b9bb5cce747b2aa60594645623257'
              },
              {
                label: '去当当购买',
                purchaseUrl:
                  'http://search.dangdang.com/?key=Paracraft%B4%B4%D2%E2%B6%AF%BB%AD%C8%EB%C3%C5&act=input'
              },
              {
                label: '去亚马逊购买',
                purchaseUrl:
                  'https://www.amazon.cn/gp/offer-listing/B076M9MG9Q/ref=sr_1_1_olp?__mk_zh_CN=%E4%BA%9A%E9%A9%AC%E9%80%8A%E7%BD%91%E7%AB%99&keywords=Paracraft%E5%88%9B%E6%84%8F%E5%8A%A8%E7%94%BB%E5%85%A5%E9%97%A8&qid=1557217364&s=gateway&sr=8-1'
              },
              {
                label: '去淘宝购买',
                purchaseUrl:
                  'https://s.taobao.com/search?q=Paracraft%E5%88%9B%E6%84%8F%E5%8A%A8%E7%94%BB%E5%85%A5%E9%97%A8&imgfile=&js=1&stats_click=search_radio_all%3A1&initiative_id=staobaoz_20190507&ie=utf8'
              },
              {
                label: '去清华大学出版社官网购买',
                purchaseUrl:
                  'http://www.tup.tsinghua.edu.cn/booksCenter/BOOK_07646101.html'
              },
              {
                label: '去中国图书网购买',
                purchaseUrl:
                  'http://www.bookschina.com/book_find2/?stp=Paracraft%u521B%u610F%u52A8%u753B%u5165%u95E8&sCate=0'
              },
              {
                label: '去孔夫子旧书网购买',
                purchaseUrl:
                  'http://search.kongfz.com/product_result/?key=Paracraft%E5%88%9B%E6%84%8F%E5%8A%A8%E7%94%BB%E5%85%A5%E9%97%A8&status=0&_stpmt=eyJzZWFyY2hfdHlwZSI6ImFjdGl2ZSJ9'
              }
            ])
          this.isShowPurchase = true
          break
        case 2:
          this.purchaseMethodsImages = require('@/assets/org/相似性与相似原理.png')
          ;(this.purchaseMethodsImagesBookName = '相似性和相似原理'),
            (this.purchaseMethodsImagesBookAuthor = '作者：李铁才、李西峙')
          this.purchaseMethods = [
            {
              label: '去京东购买',
              purchaseUrl:
                'https://search.jd.com/Search?keyword=Paracraft%E5%88%9B%E6%84%8F%E5%8A%A8%E7%94%BB%E5%85%A5%E9%97%A8&enc=utf-8&wq=Paracraft%E5%88%9B%E6%84%8F%E5%8A%A8%E7%94%BB%E5%85%A5%E9%97%A8&pvid=9e8b9bb5cce747b2aa60594645623257'
            },
            {
              label: '去当当购买',
              purchaseUrl:
                'http://search.dangdang.com/?key=Paracraft%B4%B4%D2%E2%B6%AF%BB%AD%C8%EB%C3%C5&act=input'
            },
            {
              label: '去淘宝购买',
              purchaseUrl:
                'https://s.taobao.com/search?q=Paracraft%E5%88%9B%E6%84%8F%E5%8A%A8%E7%94%BB%E5%85%A5%E9%97%A8&imgfile=&js=1&stats_click=search_radio_all%3A1&initiative_id=staobaoz_20190507&ie=utf8'
            },
            {
              label: '去孔夫子旧书网购买',
              purchaseUrl:
                'http://search.kongfz.com/product_result/?key=Paracraft%E5%88%9B%E6%84%8F%E5%8A%A8%E7%94%BB%E5%85%A5%E9%97%A8&status=0&_stpmt=eyJzZWFyY2hfdHlwZSI6ImFjdGl2ZSJ9'
            }
          ]
          this.isShowPurchase = true
          break
      }
    },
    selectImg(i) {
      this.currentImg = i.imgUrl
    },
    viewMoreInfo() {
      this.showMoreInfo = !this.showMoreInfo
    }
  }
}
</script>

<style lang="scss" scoped>
.textbook-page {
  &-book {
    background-color: #ffffff;
    border-radius: 10px;
    max-width: 1200px;
    margin: 20px auto;
    padding: 16px;
    display: flex;
    &-left {
      width: 500px;
      border-radius: 10px;
      &-images {
        text-align: center;
        padding-top: 12px;
        &-img {
          width: 80px;
          height: 80px;
          margin: 10px;
          cursor: pointer;
        }
      }
    }
    &-right {
      flex: 1;
      padding: 40px 0 0 24px;
      &-title {
        color: #303133;
        font-size: 24px;
        margin: 0;
      }
      &-hint {
        color: #b0b4bb;
        font-size: 12px;
        margin: 2px 0 23px;
      }
      &-suggest {
        color: #2397f3;
        font-size: 14px;
        margin: 0 0 20px;
      }
      &-text {
        display: flex;
        font-size: 14px;
        margin: 3px 0;
        &-label {
          color: #303133;
          width: 72px;
        }
        &-content {
          color: #909399;
          flex: 1;
        }
      }
      &-price {
        padding: 14px 0 0 0;
        &-icon {
          color: #fcb713;
          font-size: 14px;
        }
        &-count {
          color: #fcb713;
          font-size: 24px;
        }
        &-purchase {
          cursor: pointer;
          margin: 0 30px;
          background: #2397f3;
          color: #fff;
          padding: 8px 30px;
          border-radius: 20px;
          font-size: 14px;
        }
      }
    }
  }
  &-foreword {
    max-width: 1200px;
    margin: 20px auto;
    background: #fff;
    border-radius: 10px;
    &-title {
      border-bottom: 1px solid #f5f5f5;
      padding: 16px;
      color: #2397f3;
      margin: 0;
    }
    &-intro {
      padding: 18px 32px;
      &-text {
        margin: 0;
        color: #303133;
        font-size: 14px;
        line-height: 24px;
      }
      &-name {
        font-size: 14px;
        color: #303133;
        line-height: 24px;
        margin: 20px 0 0;
      }
      &-time {
        color: #909199;
        font-size: 12px;
        margin: 0;
        line-height: 24px;
      }
      &-address {
        color: #303133;
        line-height: 24px;
        margin: 0;
        font-size: 14px;
      }
      &-more {
        background: #2397f3;
        text-align: center;
        color: #fff;
        padding: 8px;
        border-radius: 18px;
        font-size: 14px;
        margin-top: 20px;
        cursor: pointer;
      }
    }
    &-long-words {
      // display: none;
    }
  }
  &-information {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    max-width: 1200px;
    margin: 20px auto;
    &-box {
      width: 590px;
      background-color: #ffffff;
      border-radius: 10px;
      &-title {
        color: #2397f3;
        font-size: 16px;
        padding: 15px;
        border-bottom: 1px solid #f5f5f5;
        box-sizing: border-box;
        margin: 0;
      }
      &-cover {
        display: flex;
        padding: 16px;
        justify-content: space-between;
        &-img {
          border-radius: 8px;
          width: 271px;
          &-image {
            object-fit: cover;
            height: 153px;
            cursor: pointer;
            width: 100%;
            cursor: pointer;
          }
          &-title {
            margin: 0;
            font-size: 14px;
            cursor: pointer;
            margin: 4px 0;
          }
        }
      }
    }
  }
  &-teachers {
    max-width: 1200px;
    margin: 20px auto;
    min-height: 300px;
    background: url(../../assets/org/long.png) center top no-repeat;
    &-desc {
      max-width: 532px;
      color: #fff;
      padding: 10px 0 0 30px;
      &-title {
        font-size: 24px;
        margin: 30px 0 0;
      }
      &-subtitle {
        color: #ffffff;
        opacity: 0.5;
        font-size: 12px;
        margin: 8px 0 11px;
      }
      &-rectangle {
        display: block;
        width: 29px;
        height: 5px;
        background-color: #2397f3;
        border-radius: 3px;
      }
      &-text {
        font-size: 14px;
        line-height: 30px;
        margin-top: 25px;
      }
      &-more {
        display: inline-block;
        padding: 6px 22px;
        // border: 1px solid #fff;
        border-radius: 18px;
        font-size: 14px;
        margin-top: 20px;
        cursor: pointer;
        background: #f5dc31;
        color: #3617a4;
      }
    }
  }
  .purchase-dialog {
    &-book {
      width: 96%;
      margin: 0 auto;
      background: #f5f5f5;
      display: flex;
      padding: 8px;
      border-radius: 8px;
      &-cover {
        width: 233px;
        height: 125px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      &-info {
        flex: 1;
        padding-left: 12px;
        &-name {
          margin: 0;
          color: #303133;
          font-size: 16px;
        }
        &-author {
          color: #909399;
          font-size: 12px;
        }
      }
    }
    &-methods {
      width: 96%;
      margin: 12px auto;
      display: flex;
      flex-wrap: wrap;
      text-align: center;
      &-method {
        border: solid 1px #2397f3;
        padding: 0 24px;
        color: #2397f3;
        display: block;
        display: flex;
        align-items: center;
        border-radius: 24px;
        margin: 10px 2px;
        width: 142px;
        height: 50px;
        box-sizing: border-box;
        text-decoration: none;
        justify-content: center;
      }
    }
  }
}
</style>

