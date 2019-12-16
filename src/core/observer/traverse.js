/* @flow */

import { _Set as Set, isObject } from '../util/index'
import type { SimpleSet } from '../util/index'
import VNode from '../vdom/vnode'

const seenObjects = new Set()
const seenThings = []
/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
export function traverse (val: any, shallow: boolean|int) {
	if(
		(val && val.vue && val.vue.shallow)
	) shallow = shallow || 1

  _traverse(val, seenObjects, shallow)
  seenObjects.clear()
	seenThings.length = 0
}

function _traverse (val: any, seen: SimpleSet, shallow: boolean|int) {
	if(shallow != 2){
		let i, keys
		const isA = Array.isArray(val)
		if ((!isA && !isObject(val)) || Object.isFrozen(val) 
			// || val instanceof VNode
		) {
			return
		}
		if (val.__ob__) {
			const depId = val.__ob__.dep.id
			if (seen.has(depId) || typeof depId == 'undefined') {
				return
			}
			seen.add(depId);
		} else {
			return
		}
		if (isA) {
			i = val.length
			while (i--) _traverse(val[i], seen, shallow ? shallow++ : shallow)
		} else {
			keys = Object.keys(val)
			i = keys.length
			while (i--) _traverse(val[keys[i]], seen, shallow ? shallow++ : shallow)
		}
	} else {
		return
	}
}
