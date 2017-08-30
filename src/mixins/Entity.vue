<script>
import { mapGetters } from 'vuex'
import EntityIcon from '../components/EntityIcon.vue'
import EntityValue from '../components/EntityValue.vue'
export default {
  components: {
    EntityIcon,
    EntityValue
  },
  computed: {
    ...mapGetters('app/entity', {
      entity: 'getEntities'
    })
  }
}
</script>
