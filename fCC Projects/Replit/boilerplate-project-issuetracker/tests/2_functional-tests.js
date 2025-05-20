const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let deleteID;
suite('Functional Tests', function() {
  suite('3 Post request Tests', function() {
    test('Create an issue with every field: POST request to /api/issues/{project}', function (done) {
      chai
        .request(server)
        .post('/api/issues/projects')
        .set('content-type', 'application/json')
        .send({
          issue_title: 'Issue',
          issue_text: 'Functional Test',
          created_by: 'fCC',
          assigned_to: 'Dom',
          status_text: 'Not Done',
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          deleteID = res.body._id;
          assert.equal(res.body.issue_title, 'Issue');
          assert.equal(res.body.assigned_to, 'Dom');
          assert.equal(res.body.created_by, 'fCC');
          assert.equal(res.body.status_text, 'Not Done');
          assert.equal(res.body.issue_text, 'Functional Test');
          done();
        });
    });
    test('Create an issue with only required fields: POST request to /api/issues/{project}', function (done) {
      chai
        .request(server)
        .post('/api/issues/projects')
        .set('content-type', 'application/json')
        .send({
          issue_title: 'Issue',
          issue_text: 'Functional Test',
          created_by: 'fCC',
          assigned_to: '',
          status_text: '',
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          deleteID = res.body._id;
          assert.equal(res.body.issue_title, 'Issue');
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.created_by, 'fCC');
          assert.equal(res.body.status_text, '');
          assert.equal(res.body.issue_text, 'Functional Test');
          done();
        });
    });
    test('Create an issue missing required fields: POST request to /api/issues/{project}', function (done) {
      chai
        .request(server)
        .post('/api/issues/projects')
        .set('content-type', 'application/json')
        .send({
          issue_title: '',
          issue_text: '',
          created_by: 'fCC',
          assigned_to: '',
          status_text: '',
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'required field(s) missing');
          done();
        });
    });
  });
  suite('3 Get request Tests', function() {
    test('View issues on a project: GET request to /api/issues/{project}', function(done) {
      chai
        .request(server)
        .get('/api/issues/Tests')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.length, 14);
          done();
        });
    });
    test('View issues on a project with one filter: GET request to /api/issues/{project}', function(done) {
      chai
        .request(server)
        .get('/api/issues/Tests')
        .query({
          _id: "6162dbe8b1fbb806f6860ac3"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body[0], {
            _id: '6162dbe8b1fbb806f6860ac3',
            issue_title: 'Faux Issue Title',
            issue_text: 'Functional Test - Required Fields Only',
            created_on: '2021-10-10T12:26:16.677Z',
            updated_on: '2021-10-10T12:26:16.677Z',
            created_by: 'fCC',
            assigned_to: '',
            open: true,
            status_text: '',
          })
          done();
        });
    });
    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done) {
      chai
        .request(server)
        .get('/api/issues/Tests')
        .query({
          issue_title: 'Faux Issue Title 2',
          issue_text: 'Functional Test - Every field filled in',
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body[0], {
            _id: '6162dbe8b1fbb806f6860ac8',
            issue_title: 'Faux Issue Title 2',
            issue_text: 'Functional Test - Every field filled in',
            created_on: '2021-10-10T12:26:16.968Z',
            updated_on: '2021-10-10T12:26:16.968Z',
            created_by: 'fCC',
            assigned_to: 'Chai and Mocha',
            open: true,
            status_text: '',
          });
          done();
        });
    });
  });
  suite('5 Put request Tests', function() {
    test('Update one field on an issue: PUT request to /api/issues/{project}', function(done) {
      chai
        .request(server)
        .put('/api/issues/Tests')
        .send({
          _id: '6162dcbeef8f11073b356d20',
          issue_title: 'newtitle',
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully updated');
          assert.equal(res.body._id, '6162dcbeef8f11073b356d20');
          done();
        });
    });
    test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function(done) {
      chai
        .request(server)
        .put('/api/issues/Tests')
        .send({
          _id: '6162dcbeef8f11073b356d20',
          issue_title: 'newtitle',
          issue_text: 'newtext',
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully updated');
          assert.equal(res.body._id, '6162dcbeef8f11073b356d20');
          done();
        });
    });
    test('Update an issue with missing _id: PUT request to /api/issues/{project}', function(done) {
      chai
        .request(server)
        .put('/api/issues/Tests')
        .send({
          issue_title: 'newtitle',
          issue_text: 'newtext',
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });
    test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function(done) {
      chai
        .request(server)
        .put('/api/issues/Tests')
        .send({
          _id: '6162dcbeef8f11073b356d20',
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'no update field(s) sent');
          done();
        });
    });
    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done) {
      chai
        .request(server)
        .put('/api/issues/Tests')
        .send({
          _id: 'dcbeef8f11073b356d20',
          issue_title: 'newtitle',
          issue_text: 'newtext',
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'could not update');
          done();
        });
    });
  });
  suite('3 DELETE request Tests', function() {
    test('Delete an issue: DELETE request to /api/issues/{project}', function(done) {
      chai
        .request(server)
        .delete('/api/issues/projects')
        .send({
          _id: deleteID,
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully deleted');
          done();
        });
    });
    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done) {
      chai
        .request(server)
        .delete('/api/issues/projects')
        .send({
          _id: "4352345353535dfgsdgd"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'could not delete');
          done();
        });
    });
    test('Deletee an issue with missing _id: DELETE request to /api/issues/{project}', function(done) {
      chai
        .request(server)
        .delete('/api/issues/projects')
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });
  });
});
