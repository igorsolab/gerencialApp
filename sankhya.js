async function sendSankhyaRequest(method, url, data) {
    const cookie = jnid ? `JSESSIONID=${jnid}` : '';
    const options = {
        method: method,
        url: url,
        headers: {
            'Content-Type': 'application/json',
            cookie
        },
        data: data
    };
    console.log('Options: ', options)
    return await axios.request(options).then(function(response) {
        // console.log(response.data);
        if(response.data && response.data.responseBody && response.data.responseBody.rows){
            console.log(response.data.responseBody.rows);
        }
        return response.data;
    }).catch(function(error) {
        return error;
    }); 
}

async function dbExplorer(sql = '') {
    const data = {
        serviceName: 'DbExplorerSP.executeQuery',
        requestBody: {
            sql: sql
        }
    }

    const url = "http://"+hostname+":"+port+"/mge/service.sbr?serviceName=DbExplorerSP.executeQuery&outputType=json&mgeSession="+jnid;
    try {
        const result = await sendSankhyaRequest("POST", url, JSON.stringify(data));
        
        if (result.responseBody && result.responseBody.rows) {
            return result.responseBody.rows;
        } else {
            return 'Erro ao executar a query:' + result.statusMessage;
        }
    } catch (err) {
        throw new Error(err);
    }
}

function getDadosSql(sql, resultAsObject){
	if ( resultAsObject == null ) resultAsObject = false;
    var dados;
    var data = JSON.stringify({
    "serviceName": " DbExplorerSP.executeQuery",
    "requestBody": {
        "sql": sql
    }});
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {

          let data2 = JSON.parse(this.response);
		  let fieldsMetaData = data2.responseBody.fieldsMetadata;
		    // console.log("Data02",this.response);
          if ( resultAsObject ) {
			  dados = [];
			  for (let z = 0; z < data2.responseBody.rows.length; z++){
				  var baseObject = new Object();
				  for (let y = 0; y < fieldsMetaData.length; y++){
					baseObject[fieldsMetaData[y].name] = data2.responseBody.rows[z][y];
					baseObject[fieldsMetaData[y].name.toLowerCase()] = data2.responseBody.rows[z][y];
				  }
				  dados.push(baseObject);
			  }
		  } else {
			dados = data2.responseBody.rows;
		  }
        //   console.log("Dados", dados);

      }});

    xhr.open("POST", "http://"+hostname+":"+port+"/mge/service.sbr?serviceName=DbExplorerSP.executeQuery&outputType=json&mgeSession="+jnid, false);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data, true);
    return dados;
}

    function stopLoading(myModal){     
        console.log("stopLoading")
        myModal.hide();
    }


// incluir/editar Registro no sankhya XHR 
function saveRecord(entity,fields,key){

    let result;
  
    let url = "http://"+hostname+":"+port+"/mge/service.sbr?serviceName=CRUDServiceProvider.saveRecord&outputType=json&mgeSession="+jnid;
    let obj = {
        "serviceName":"CRUDServiceProvider.saveRecord",
        "requestBody":{
           "dataSet":{
                "rootEntity":entity,
                "includePresentationFields":"S",
                "dataRow":{
                    "localFields": {
                        "NUNOTA":fields.NUNOTA,
                        "CONFIRMADO":fields.CONFIRMADO,
                        "DHCONFIRMADO":fields.DHCONFIRMADO,
                        "CODUSU": fields.CODUSU,
                        "REPROVADO":fields.REPROVADO,
                        "CODUSUREP":fields.CODUSUREP,
                        "DESCREP":fields.DESCREP
                    }
                }, "entity":{
                    "fieldset":{
                        "list":"*"
                    }
                }
            }
        }
    }
    if(key != "") {
        obj.requestBody.dataSet.dataRow.key = {NUNOTA:key}
    }
    console.log(obj)
  
    const data = JSON.stringify(obj);
    console.log(JSON.stringify(obj))
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
  
    xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
        let data2 = JSON.parse(this.response);
        if(data2.responseBody != undefined){
            result = data2.responseBody.entities.entity;
        }else{
            alert(`Erro ao salvar dados! <br> Erro : <br> ${this.responseText}`);
        }
    }});
  
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
  
    return result
  }