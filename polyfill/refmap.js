// @ts-check

/**
 * RefMap Polyfill that will leak the references.
 */
export default class RefMap {
    _symbolMap = new Map();
    _objMap = new Map();

    /**
     * Creates an object reference tracked by the reference map
     * @param {Object} objectReference The object to be referenced
     * @returns {unique symbol} A symbol representing the ref to the object
     */
    ref(objectReference) {
        if (this._objMap.has(objectReference)) {
            return this._objMap.get(objectReference);
        }
        const refSymbol = Symbol();
        this._symbolMap.set(refSymbol, objectReference);
        this._objMap.set(objectReference, refSymbol);
        return refSymbol;
    }

    /**
     * Creates an object reference tracked by the reference map
     * @param {symbol} referenceSymbol The ref used for object lookup
     * @returns {Object} The referenced object
     */
    deref(referenceSymbol) {
        return this._symbolMap.get(referenceSymbol);
    }

    /**
     * Releases a ref from the polyfilled RefMap
     * @deprecated
     * @param {symbol} referenceSymbol The ref to release
     * @returns {void}
     */
    POLYFILL_ONLY_releaseRef(referenceSymbol) {
        this._objMap.delete(this._symbolMap.get(referenceSymbol));
        this._symbolMap.delete(referenceSymbol);
    }
}