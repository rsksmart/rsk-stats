import entities from '../../../../config/entities.js'
import { thresholds, status } from '../../../../config/thresholds.js'

export default function () {
  return {
    entities: entities,
    thresholds: thresholds,
    status: status,
    renderedEntities: {}
  }
}
