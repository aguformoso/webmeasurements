define(['simon', 'jquery', 'jquery-public'], function(SIMON, jQ) {

    /*
      SIMON tests
      'jquery-public' will register itself globally as $
    */

    describe("Definitions", function() {

      it("Global $ *is* defined", function() {
        expect($).toBeDefined();
      });

      it("jQuery (jQ) is defined", function() {
        expect(jQ).toBeDefined();
      });

      it("SIMON is defined", function() {
        expect(SIMON).toBeDefined();
      });

      it("SIMON has init()", function() {
        expect(SIMON.init).toBeDefined();
      });

    }); // end describe

    describe("jQuery conflicts", function() {

      it("jQuery (jQ) version", function() {
        expect(jQ.fn.jquery).toBe('1.11.1');
      });

      it("jQuery ($) version", function() {
        expect($.fn.jquery).toBe('1.6.2');
      });

    }); // end describe

}); // end define
