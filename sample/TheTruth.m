classdef TheTruth < matlab.unittest.TestCase
    methods (Test)
        function testTheTestOfAllTime(testCase)
            onetyone = 11;
            testCase.verifyEqual(onetyone, 11);
        end
    end
end
