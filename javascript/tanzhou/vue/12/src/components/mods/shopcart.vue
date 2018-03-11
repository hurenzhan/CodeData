<template>
  <div class="shopCart">
    <div class="content">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo active">
            <i class="icon-shopping_cart"></i>
          </div>
          <div class="badge">1</div>
        </div>
        <div class="price">总价</div>
        <div class="desc">另需要配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <div class="pay">还差{{minPrice}}元</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['deliveryPrice', 'minPrice']
  }
</script>
