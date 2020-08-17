import { serverUp } from '../src/server/server'

describe("Testing the server functionality", () => {  
    test("Testing the server function", () => {
           expect(serverUp).toBeDefined();
})});