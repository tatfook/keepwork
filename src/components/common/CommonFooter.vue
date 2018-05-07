<template>
  <div class="footer-container">
    <ul>
      <li>
        <a href="#" target="_blank">{{$t('common.openPlatform')}}</a>
      </li>
      <li>
        <a href="#" target="_blank">{{$t('common.joinUs')}}</a>
      </li>
      <li>
        <a href="#" target="_blank">{{$t('common.websiteStatistics')}}</a>
      </li>
      <li>
        <a href="#" target="_blank">{{$t('common.updateInformation')}}</a>
      </li>
      <li>
        <a href="#" target="_blank">{{$t('common.feedback')}}</a>
      </li>
      <li>
        <a href="#" target="_blank">{{$t('common.complaintPage')}}</a>
      </li>
      <li>
        <a href="#" target="_blank">{{$t('common.poweredByNPL')}}</a>
      </li>
      <li>
        <a href="#" target="_blank">{{$t('common.simplifiedChinese')}}</a>
      </li>
    </ul>
    <p>
      <span>{{$t('common.caseNumberA')}}</span>
      <span>{{$t('common.caseNumberB')}}</span>
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
p {
  margin: 0;
}
.footer-container span {
  font-size: 14px;
}
@media (max-width: 768px) {
  a {
    margin: 0;
  }
}
</style>


