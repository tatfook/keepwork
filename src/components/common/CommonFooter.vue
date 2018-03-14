<template>
  <div class="footer-container">
    <ul>
      <li>
        <a href="#" target="_blank">开放平台</a>
      </li>
      <li>
        <a href="#" target="_blank">加入我们</a>
      </li>
      <li>
        <a href="#" target="_blank">网站统计</a>
      </li>
      <li>
        <a href="#" target="_blank">更新信息</a>
      </li>
      <li>
        <a href="#" target="_blank">问题反馈</a>
      </li>
      <li>
        <a href="#" target="_blank">投诉本页</a>
      </li>
      <li>
        <a href="#" target="_blank">Powered By NPL</a>
      </li>
      <li>
        <a href="#" target="_blank">简体中文</a>
      </li>
    </ul>
    <p>
      <span>粤ICP备14002196号-2</span>
      <span>© Tatfook</span>
    </p>
  </div>
</template>

<script>
export default {
  name: 'CommonFooter'
}
</script>

<style scoped>
ul {
  margin: 0;
  padding: 0;
}
ul > li {
  list-style: none;
  display: inline-block;
  padding-bottom: 6px;
}
a {
  color: #3977ad;
  padding: 0 5px 5px;
  margin: 0 25px;
  text-decoration: none;
  font-size: 14px;
}
a:hover {
  border-bottom: 2px solid #3977ad;
}
p{
  margin: 0;
}
.footer-container span{
  font-size: 14px;
}
@media(max-width: 768px){
  a{
    margin: 0;
  }
}
</style>


