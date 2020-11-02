import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

export default {
    getGeolocation (placeName, cb, errorCb) {
        const getGeoLocationUrl = "https://restapi.amap.com/v3/geocode/geo?address=" + placeName + "&key=" + "your web js api key";

        Vue.axios.get(getGeoLocationUrl, )
            .then((response) => {
                const data = response.data;
                const geocodes = data && data.geocodes;
                if (geocodes && geocodes.length !== 0) {
                    const geocode = geocodes[0].location;
                    geocode ? cb(geocode) : errorCb('');
                } else {
                    errorCb('');
                }
            })
            .catch((err) => {
                console.log(err);
                errorCb('');
            });
    }
}
