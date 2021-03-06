"use strict";
const TSParser_1 = require('../lib/TSParser');
const chai = require('chai');
describe('MSSQL 2 Basic Queries', function () {
    it('should return an array with 2 items', function () {
        var query = 'SELECT * FROM users GO SELECT * FROM user_details';
        var expectedResult = [];
        expectedResult.push('SELECT * FROM users');
        expectedResult.push('SELECT * FROM user_details');
        var result = TSParser_1.TSParser.parse(query, 'mssql', 'GO');
        chai.expect(result).have.members(expectedResult, 'Should be an array of string with 2 members.');
    });
});
describe('MSSQL Multi-statement', function () {
    it('should return an array with 1 item', function () {
        var query = 'SELECT * FROM users; SELECT * FROM user_details';
        var expectedResult = [];
        expectedResult.push('SELECT * FROM users; SELECT * FROM user_details');
        var result = TSParser_1.TSParser.parse(query, 'mssql', 'GO');
        chai.expect(result).have.members(expectedResult, 'Should be an array of string with 2 members.');
    });
});
describe('MSSQL 2 Basic Queries - Syntax Error', function () {
    it('should not return an array with 2 items', function () {
        var query = 'SELECT * FROM users SELECT * FROM user_details;';
        var expectedResult = [];
        expectedResult.push('SELECT * FROM users');
        expectedResult.push('SELECT * FROM user_details');
        var result = TSParser_1.TSParser.parse(query, 'mssql', 'GO');
        chai.expect(result).not.have.members(expectedResult, 'Should be an array of string with 2 members.');
    });
});
describe('MSSQL Procedure', function () {
    it('should return MSSQL procedure', function () {
        var query = `CREATE PROCEDURE dbo.uspGetAddress @City nvarchar(30)
AS
SELECT * 
FROM Person.Address
WHERE City = @City
GO`;
        var expectedResult = `CREATE PROCEDURE dbo.uspGetAddress @City nvarchar(30)
AS
SELECT * 
FROM Person.Address
WHERE City = @City`;
        var result = TSParser_1.TSParser.parse(query, 'mssql', 'GO');
        chai.expect(result).include(expectedResult, 'Returning result must include query itself.');
    });
});
describe('MSSQL Procedures', function () {
    it('should return 2 MSSQL procedures', function () {
        var query = `CREATE PROCEDURE dbo.uspGetAddress @City nvarchar(30)
AS
SELECT * 
FROM Person.Address
WHERE City = @City;
GO
CREATE PROCEDURE dbo.uspGetAddress @City nvarchar(30)
AS
SELECT * 
FROM Person.Address
WHERE City = @City`;
        var expectedResult = [];
        expectedResult.push(`CREATE PROCEDURE dbo.uspGetAddress @City nvarchar(30)
AS
SELECT * 
FROM Person.Address
WHERE City = @City;`);
        expectedResult.push(`CREATE PROCEDURE dbo.uspGetAddress @City nvarchar(30)
AS
SELECT * 
FROM Person.Address
WHERE City = @City`);
        var result = TSParser_1.TSParser.parse(query, 'mssql', 'GO');
        chai.expect(result).have.members(expectedResult, 'Should be an array of string with 2 stored procedures.');
    });
});
describe('MSSQL Procedure and SQL Queries', function () {
    it('should return MSSQL procedure and other statements', function () {
        var query = `CREATE PROCEDURE dbo.uspGetAddress @City nvarchar(30)
AS
SELECT * 
FROM Person.Address
WHERE City = @City;
GO
SELECT * FROM users;
GO
SELECT * FROM user_details;`;
        var expectedResult = [];
        expectedResult.push(`CREATE PROCEDURE dbo.uspGetAddress @City nvarchar(30)
AS
SELECT * 
FROM Person.Address
WHERE City = @City;`);
        expectedResult.push("SELECT * FROM users;");
        expectedResult.push("SELECT * FROM user_details;");
        var result = TSParser_1.TSParser.parse(query, 'mssql', 'GO');
        chai.expect(result).have.members(expectedResult, 'Should be an array of string with 1 stored procedure and 2 queries.');
    });
});
describe('MSSQL Procedure and SQL Queries - Syntax Error', function () {
    it('should not return MSSQL procedure and other statements', function () {
        var query = `CREATE PROCEDURE dbo.uspGetAddress @City nvarchar(30)
AS
SELECT * 
FROM Person.Address
WHERE City = @City;
SELECT * FROM users
SELECT * FROM user_details;`;
        var expectedResult = [];
        expectedResult.push(`CREATE PROCEDURE dbo.uspGetAddress @City nvarchar(30)
AS
SELECT * 
FROM Person.Address
WHERE City = @City;`);
        expectedResult.push("SELECT * FROM users");
        expectedResult.push("SELECT * FROM user_details;");
        var result = TSParser_1.TSParser.parse(query, 'mssql', 'GO');
        chai.expect(result).not.have.members(expectedResult, 'Should be an array of string with 1 stored procedure and 2 queries.');
    });
});
describe('MSSQL Queries with Comments and String', function () {
    it('should return an array with 2 items', function () {
        var query = `SELECT ';', '--', ';;;;' FROM test -- comment
-- comment 2
// comment other
# comment
go
SELECT name,surname FROM user_details;`;
        var expectedResult = [];
        expectedResult.push(`SELECT ';', '--', ';;;;' FROM test -- comment
-- comment 2
// comment other
# comment`);
        expectedResult.push(`SELECT name,surname FROM user_details;`);
        var result = TSParser_1.TSParser.parse(query, 'mssql', 'GO');
        chai.expect(result).have.members(expectedResult, 'Should be an array of string with 2 members.');
    });
});
//# sourceMappingURL=MSSQL.js.map