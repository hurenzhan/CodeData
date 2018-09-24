import layoutMutations from './mutations/layoutMutaions'
import chartLabelStyle from './mutations/chartLabelStyle'
import chartCardStyle from './mutations/chartCardStyle'
import searchMutations from './mutations/searchMutations'
import textMutations from './mutations/textMutations'
import iframeMutations from './mutations/iframeMutations'
import pieMutations from './mutations/pieMutations'
import tableMutations from './mutations/tableMutations'
import simpleTableMutations from './mutations/simpleTableMutations'
import crossTableMutations from './mutations/crossTableMutations'
import mapMutations from './mutations/mapMutations'
import lineMutations from './mutations/lineMutations'
import tabMutation from './mutations/tabMutation'
import chartRelation from './mutations/chartRelation'
import relationMutations from './mutations/relationMutations'
import wordCloudMutations from './mutations/wordCloudMutations'
import barMutations from './mutations/barMutations'
import scatterMutations from './mutations/scatterMutations'
import radarMutations from './mutations/radarMutations'
import gaugeMutations from './mutations/gaugeMutations'
import bubbleMutations from './mutations/bubbleMutations'
import funnelMutations from './mutations/funnelMutations'
import warnMutaions from './mutations/warnMutaions'
import dataFilters from './mutations/dataFilters'
import dataSetAlias from './mutations/dataSetAliasMutation'
const mutations = {
  ...layoutMutations,
  ...chartLabelStyle,
  ...chartCardStyle,
  ...searchMutations,
  ...pieMutations,
  ...tableMutations,
  ...simpleTableMutations,
  ...crossTableMutations,
  ...textMutations,
  ...iframeMutations,
  ...mapMutations,
  ...lineMutations,
  ...tabMutation,
  ...chartRelation,
  ...relationMutations,
  ...barMutations,
  ...wordCloudMutations,
  ...radarMutations,
  ...scatterMutations,
  ...gaugeMutations,
  ...bubbleMutations,
  ...funnelMutations,
  ...warnMutaions,
  ...dataFilters,
  ...dataSetAlias
}

export default mutations
