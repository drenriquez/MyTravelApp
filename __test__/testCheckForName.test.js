import { checkForName } from "../src/client/js/nameChecker"

// The describe() function takes two arguments - a string description, and a test suite as a callback function.
// A test suite may contain one or more related tests
describe("Testing the URL", () => {
    // The test() function has two arguments - a string description, and an actual test as a callback function.
    
    test("Testing for correct url in the checkForName() function", () => {
        let URLtest="https://github.com/drenriquez/evaluate-new-NPL"
         
           expect(checkForName(URLtest)).toBe(1);
    
        }
    );
    test("Testing for uncorrect url in the checkForName() function", () => {
        let URLtest=""
         
           expect(checkForName(URLtest)).toBe(0);
    
        }
    );


});
