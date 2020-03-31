// @ts-check

/**
 * RefMap Polyfill that will leak the references.
 */
export default class RefCollection {
    _symbolMap = new Map();
    _objMap = new Map();

    /**
     * Creates an object reference tracked by the reference map
     * @param {Object} objectReference The object to be referenced
     * @param {symbol} [newSymbol] Optional symbol to use if the object is not
     *      in the RefMap already. The function will throw if that symbol is
     *      already referencing an object in the RefMap. If the object is
     *      alread
     * @returns {symbol} A symbol representing the ref to the object
     */
    ref(objectReference, newSymbol = Symbol()) {
        if (this._objMap.has(objectReference)) {
            return this._objMap.get(objectReference);
        }
        if (this._symbolMap.has(newSymbol)) {
            throw new TypeError(
                `${String(newSymbol)} already refers to an object`
            );
        }
        this._symbolMap.set(newSymbol, objectReference);
        this._objMap.set(objectReference, newSymbol);
        return newSymbol;
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