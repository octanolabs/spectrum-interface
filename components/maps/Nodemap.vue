<!--<template>-->
<!--  <l-map-->
<!--    :minZoom="2"-->
<!--    :maxZoom="8"-->
<!--    :zoom="2"-->
<!--    :center="[40, 0]"-->
<!--    style="height: 500px; width: 750px;"-->
<!--  >-->
<!--    <l-icondefault></l-icondefault>-->
<!--    <l-tilelayer-->
<!--      url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png"-->
<!--    ></l-tilelayer>-->
<!--    <l-marker-cluster ref="clusterRef" :options="clusterOptions">-->
<!--      <l-marker-->
<!--        v-for="l in locations"-->
<!--        :key="l.id"-->
<!--        :lat-lng="l.lat_lng"-->
<!--        :icon="icon"-->
<!--      >-->
<!--        <l-popup :content="l.id"></l-popup>-->
<!--      </l-marker>-->
<!--    </l-marker-cluster>-->
<!--  </l-map>-->
<!--</template>-->

<!--<script>-->
<!--import L from 'leaflet'-->
<!--import * as Vue2Leaflet from 'vue2-leaflet'-->
<!--import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'-->
<!--import iconUrl from 'leaflet/dist/images/marker-icon.png'-->
<!--import shadowUrl from 'leaflet/dist/images/marker-shadow.png'-->

<!--export default {-->
<!--  components: {-->
<!--    'l-map': Vue2Leaflet.LMap,-->
<!--    'l-tilelayer': Vue2Leaflet.LTileLayer,-->
<!--    'l-icondefault': Vue2Leaflet.LIconDefault,-->
<!--    'l-marker': Vue2Leaflet.LMarker,-->
<!--    'l-popup': Vue2Leaflet.LPopup,-->
<!--    'l-marker-cluster': Vue2LeafletMarkerCluster-->
<!--  },-->
<!--  props: ['locations'],-->
<!--  data() {-->
<!--    const icon = L.icon(-->
<!--      Object.assign({}, L.Icon.Default.prototype.options, {-->
<!--        iconUrl,-->
<!--        shadowUrl-->
<!--      })-->
<!--    )-->
<!--    return {-->
<!--      icon,-->
<!--      clusterOptions: {-->
<!--        disableClusteringAtZoom: 12,-->
<!--        maxClusterRadius: 60-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--  created() {-->
<!--    setTimeout(() => {-->
<!--      this.$nextTick(() => {-->
<!--        this.clusterOptions = {-->
<!--          disableClusteringAtZoom: 12-->
<!--        }-->
<!--      })-->
<!--    }, 5000)-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style>-->
<!--@import '../../../node_modules/leaflet/dist/leaflet.css';-->
<!--@import '../../../node_modules/leaflet.markercluster/dist/MarkerCluster.css';-->
<!--@import '../../../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css';-->
<!--html,-->
<!--body {-->
<!--  height: 100%;-->
<!--  margin: 0;-->
<!--}-->

<!--.leaflet-popup-content-wrapper {-->
<!--  background-color: #333333b8;-->
<!--}-->

<!--.leaflet-popup-content {-->
<!--  color: #00ea90;-->
<!--}-->

<!--.leaflet-popup-content-wrapper,-->
<!--.leaflet-popup-tip {-->
<!--  background: #333333b8;-->
<!--}-->

<!--.marker-cluster-small,-->
<!--.marker-cluster-medium,-->
<!--.marker-cluster-large {-->
<!--  background-color: #00000000;-->
<!--}-->
<!--</style>-->
