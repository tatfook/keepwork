<template>
  <div class="teaching-group">
    <div class="teaching-group-teachers">
      <div class="teaching-group-teachers-desc">
        <h4 class="teaching-group-teachers-desc-title">师资团队</h4>
        <p class="teaching-group-teachers-desc-text">我们的师资团队由拥有丰富教学经验和多年开发经验的职业程序员组成，致力于拓展编程教育愿景，希望能够帮助中国培养下一代优秀的程序员，也帮助更广大家庭的孩子们学会自主学习的方法。</p>
      </div>
    </div>
    <div class="teaching-group-person">
      <h4 class="teaching-group-person-name">李西峙</h4>
      <p class="teaching-group-person-intro">1982年出生于哈尔滨。2005年获浙江大学计算机学科学士学位（竺可桢荣誉学院），同年创建ParacEngine分布式游戏引擎开发工作室。在国内外会议和刊物上发表游戏引擎，脚本语言技术，三维动画制作，CPU芯片设计相关论文和著作8篇。2007年，获得美国投资基金IDG和国内著名IT企业家投资，创建深圳市派瑞安擎科技有限公司（ParaEngine），任CEO。2016年开始，因为自己小时候自主学习的深刻体验，把自己开发的游戏引擎和相关生态软件开放出来打造成一个自主学习的平台（即Paracraft+KeepWork），希望能够帮助中国培养下一代的优秀的程序员，也帮助更广大家庭的孩子们学会自主学习的方法。 西峙在儿童编程教学方面有大量的实践经验，并结合着自己自7岁开始的30多年的编程经验，对儿童如何学习编程有着深入全面的思考。Paracraft全生态编程学习环境的设计正是来自于他的经验和思考，其中的一对一的指导服务也正是复制西峙幼年时学习编程的重要体验。</p>
      <p class="teaching-group-person-intro"><a class="text-color-blue" href="https://keepwork.com/lixizhi/note/design/future_education">Paracraft作者李西峙关于未来教育的思考</a></p>
    </div>
    <div class="teaching-group-person border-color-yellow">
      <h4 class="teaching-group-person-name">刘远亮</h4>
      <p class="teaching-group-person-intro">开源学习创始人和自主学习布道者，知识引擎的设计者，软件构架师。浙江大学本科毕业，留美双硕士，拥有哥伦比亚大学，华尔街，国内多家知名互联网企业工作经验，前华为互联网教育首席架构师，在学习/教育领域专注了近20年。对学术界和工业界的互联网教育研究和开发有全面深入的了解，并大量参与美国民间的教育实践，结合自己的丰富的自主学习经验和软件实践，获得了对学习和教育深入系统的认识。知识引擎的设计思想相当程度上来源于他在软件编程，禅，生物医学（尤其是神经，大脑和基因），以及广泛的人文和科学等方面的自主学习的重要体验。</p>
      <p class="teaching-group-person-intro">远亮拥有丰富的教学经验，教过各种不同的群体，如儿童，青少年，大学生，青年进城务工群体，老年等等，并在教学中广泛使用<a class="text-color-yellow" href="http://blog.opensourcelearning.org/?p=122&lang=zh">以重要体验为基础</a>的教学方法。实际上，因为相信教学相长的道理，他可以说无时不刻不在学习和教之中，当然除了玩的时候。</p>
      <p class="teaching-group-person-intro"><a class="text-color-yellow" href="http://www.opensourcelearning.org/">了解开源学习。</a>开源学习组织是<a class="text-color-yellow" href="https://www.self-directed.org/">美国自主教育联盟（ASDE）</a>在中国的联系组织。</p>
    </div>
    <div class="teaching-group-person">
      <h4 class="teaching-group-person-name">陈清华</h4>
      <p class="teaching-group-person-intro">Keepwork首席架构师&拥有多年开发经验的程序员。</p>
    </div>
    <div class="teaching-group-person border-color-yellow">
      <h4 class="teaching-group-person-name">李俊杰 & 谭雯文</h4>
      <p class="teaching-group-person-intro">Paracraft动画与教学视频制作者，参与制作了大量Paracraft动画与教学视频。PAC全国3D创作大赛指导老师, 设计师，组织过多次Paracraft大赛。</p>
    </div>
    <div class="teaching-group-person">
      <h4 class="teaching-group-person-name">25位助教</h4>
      <p class="teaching-group-person-intro">NPL语言/Paracraft软件开发团队的程序员。</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TeachingGroup'
}
</script>
<style lang="scss" scoped>
.teaching-group {
  &-teachers {
    max-width: 1200px;
    margin: 0 auto 24px;
    min-height: 300px;
    background: url(../../assets/study/teacher.png) center top no-repeat;
    &-desc {
      max-width: 530px;
      color: #fff;
      padding: 10px 0 0 30px;
      &-title {
        font-size: 24px;
      }
      &-text {
        font-size: 14px;
        line-height: 36px;
      }
    }
  }
  &-person {
    max-width: 1200px;
    margin: 24px auto;
    box-sizing: border-box;
    background: #fff;
    border-radius: 10px;
    border-left: 8px solid #2397f3;
    padding: 24px 48px 24px 24px;
    &-name {
      margin: 8px 0 42px;
      font-size: 24px;
      color: #303133;
    }
    &-intro {
      font-size: 14px;
      line-height: 26px;
      color: #303133;
    }
  }
  .text-color-blue {
    color: #2397f3;
  }
  .text-color-yellow {
    color: #f38f23;
  }
  .border-color-yellow {
    border-color: #f38f23;
  }
}
</style>

