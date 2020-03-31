// @ts-check

import test from "tape";
import RefCollection from "./refcoll.js";

test("basic ref and deref", t => {
    t.plan(2);

    const refc = new RefCollection();
    const obj = {};
    const ref = refc.ref(obj);
    const deref = refc.deref(ref);

    t.equal(typeof ref, "symbol", "refs are symbols");
    t.equal(deref, obj, "object lookup is successful");
});

test("multiple ref and deref", t => {
    const N_REFS = 3;
    t.plan(N_REFS);

    const refc = new RefCollection();
    const objs = [];
    const refs = [];

    for (let i = 0; i < N_REFS; i++) {
        const obj = {};
        objs.push(obj);
        refs.push(refc.ref(obj));
    }
    
    for (let i = 0; i < N_REFS; i++) {
        const obj = objs[i];
        const ref = refs[i];
        const deref = refc.deref(ref);

        t.equal(deref, obj, `refs[${i}] derefs to objs[${i}]`);
    }
});

test("stable ref creation", t => {
    t.plan(1);

    const refc = new RefCollection();
    const obj = {};
    const ref1 = refc.ref(obj);
    const ref2 = refc.ref(obj);

    t.equal(
        ref1,
        ref2,
        "creating a ref for the same object returns the same ref"
    );
});

test("multiple refs are different for different objects", t => {
    const N_REFS = 3;
    t.plan(N_REFS * N_REFS - N_REFS);

    const refc = new RefCollection();
    const refs = [];

    for (let i = 0; i < N_REFS; i++) {
        const obj = {};
        refs.push(refc.ref(obj));
    }
    
    for (let i = 0; i < N_REFS; i++) {
        for (let j = 0; j < N_REFS; j++) {
            const refi = refs[i];
            const refj = refs[j];

            if (i !== j) {
                t.notEqual(refi, refj, `refs[${i}] differs from refs[${j}]`);
            }
        }
    }
});

test("uses provided symbol", t => {
    t.plan(2);

    const refc = new RefCollection();
    const obj = {};
    const ref0 = Symbol("ref0");
    const ref1 = refc.ref(obj, ref0);
    const ref2 = refc.ref(obj);

    t.equal(
        ref1,
        ref0,
        "refc.ref uses the provided symbol"
    );
    t.equal(
        ref1,
        ref2,
        "a ref for the same object returns the same ref"
    );
});

test("ignores provided symbol", t => {
    t.plan(2);

    const refc = new RefCollection();
    const obj = {};
    const ref0 = Symbol("ref0");
    const ref1 = refc.ref(obj);
    const ref2 = refc.ref(obj, ref0);

    t.notEqual(
        ref2,
        ref0,
        "refc.ref avoids the provided symbol if it wasn't there at first"
    );
    t.equal(
        ref1,
        ref2,
        "a ref for the same object returns the same ref"
    );
});

test("crashes if reusing an existing symbol", t => {
    t.plan(1);

    const refc = new RefCollection();
    const ref = refc.ref({});
    t.throws(() => {
        refc.ref({}, ref);
    }, "throws when reusing an existing ref in the refc");
});

test("does not crash if given consistenly the same ref", t => {
    t.plan(1);

    const refc = new RefCollection();
    const obj ={};
    const ref1 = refc.ref(obj);
    const ref2 = refc.ref(obj, ref1);
    
    t.equal(
        ref1,
        ref2,
        "a ref for the same object returns the same ref"
    );
});

test("POLYFILL_ONLY_releaseRef", t => {
    t.plan(2);

    const refc = new RefCollection();
    const obj = {};
    const ref = refc.ref(obj);
    refc.POLYFILL_ONLY_releaseRef(ref);
    const deref = refc.deref(ref);
    const newref = refc.ref(obj);

    t.equal(deref, undefined, "object lookup gives undefined");
    t.notEqual(ref, newref,
        "creating a new ref after release gives a different ref");
});