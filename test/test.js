var assert = chai.assert;

var pathname = window.location.pathname
var splits = pathname.split('/')
//expected /v1/o/:orgname/e/:env/samples/:sample/test.html
var org = splits[3]
var env = splits[5]
var sample = splits[7]

getTestData(org,env,sample,function(data){
	//i don have any data for this proxy
})

var url = 'https://' + org + '-' + env + '.apigee.net/quota-basic'
describe('QuotaBasic', function(){
	describe('calling ' + url, function(){
		it('make 5 API calls, only 2 should succeed', function(done){
			async.times(5,function(n,next){
				$.ajax({
					url:url,
					complete:function(xhr,statusText){ next(null,xhr.status)}
				})
			},function(cberror,codes){
				var success_200 = 0				
				codes.forEach(function(s){ if (s==200) success_200++}) 
				assert.equal(2,success_200)
				done(cberror)
			})
		})
	})
})