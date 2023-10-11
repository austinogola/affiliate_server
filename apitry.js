const crypto = require('crypto');

function ksort(obj) {
    const keys = Object.keys(obj);
    keys.sort();
    
    const sortedObj = {};
    keys.forEach(key => {
      sortedObj[key] = obj[key];
    });
    
    return sortedObj;
  }

  const jsonPayload={
    "ItemIds": [
     "B085W5TPLN"
    ],
    "Resources": [
     "ItemInfo.Features",
     "ItemInfo.Title"
    ],
    "PartnerTag": "ekinazkay-20",
    "PartnerType": "Associates",
    "Marketplace": "www.amazon.com",
    "Operation": "GetItems"
   }

  async function calculateHMAC(data, kSecret) {
    return new Promise(async(resolve, reject) => {
        const hmac = await crypto.createHmac('sha256', kSecret);
        await hmac.update(data);
        let digest = await hmac.digest()
        resolve (digest); 
    })
    // console.log(typeof data)
    
  }

async function calculateSHA256ToBin(data) {
    return new Promise(async(resolve, reject) => {
      const sha256 = crypto.createHash('sha256');
      await sha256.update(data);
      const hashBuffer = await sha256.digest();
      resolve(new Uint8Array(hashBuffer));
    });
  }

  function binToHex(binaryData) {
    return Array.from(binaryData, byte => {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
  }

class AwsV4 {
    constructor(access_key, secret_key) {
      this.access_key = access_key;
      this.secret_key = secret_key;
      this.xAmzDate = this.getTimeStamp ()
      this.currentDate = this.getDate ()
      this.HMACAlgorithm = "AWS4-HMAC-SHA256";
      this.aws4Request = "aws4_request";
      this.awsHeaders={}
    }

    setRegionName(regionName) {
        this.regionName = regionName;
    }

    setPath(path) {
        this.path = path;
    }

    setServiceName(serviceName) {
        this.serviceName = serviceName;
    }

    setPayload(payload) {
        this.payload = payload;
    }

    setRequestMethod(method) {
        this.httpMethodName = method;
    }

    addHeader(headerName, headerValue) {
        this.awsHeaders [headerName] = headerValue;
    }
    async getHeaders() {
        return new Promise(async(resolve, reject) => {
            this.awsHeaders['x-amz-date'] =this.xAmzDate;
       //99
    //    ksort (this.awsHeaders );
       this.awsHeaders=ksort (this.awsHeaders );

       

        // Step 1: CREATE A CANONICAL REQUEST
       let canonicalURL =await this.prepareCanonicalRequest ();
       

        // Step 2: CREATE THE STRING TO SIGN
        let  stringToSign =await this.prepareStringToSign (canonicalURL );
        // console.log(this.awsHeaders);

        // Step 3: CALCULATE THE SIGNATURE
       let signature =await this.calculateSignature (stringToSign );
       console.log(this.awsHeaders);
       

        // Step 4: CALCULATE AUTHORIZATION HEADER
        if (signature) {
           this.awsHeaders ['Authorization'] =this.buildAuthorizationString (signature );
            resolve (this.awsHeaders)
        }
        })
       
    }

    async prepareCanonicalRequest() {
        return new Promise(async(resolve, reject) => {
            // console.log(this.httpMethodName,this.path);
            let canonicalURL = "";
        canonicalURL += this.httpMethodName+ "\n";
        canonicalURL += encodeURIComponent(this.path)+ "\n"
        canonicalURL +=""+'\n'
        let signedHeaders = ''
        Object.entries(this.awsHeaders).forEach(([key, value]) => {
            signedHeaders += key + ";";
            canonicalURL += key + ":" + value + "\n";
        })
        canonicalURL += "\n";
        console.log(canonicalURL);
        //999
        // this.strSignedHeader = substr ( signedHeaders, 0, - 1 );
        this.strSignedHeader = signedHeaders.slice(0, -1);
        canonicalURL += this.strSignedHeader + "\n";

        canonicalURL += await this.generateHex ( this.payload );
        resolve (canonicalURL);
        })
        
    }
    async generateHex(data) {
        return new Promise(async(resolve, reject) => {
            //999
        // return strtolower ( bin2hex ( hash ( "sha256", data, true ) ) );
        const binHashed=await calculateSHA256ToBin (data)
        const hashHex=binToHex(binHashed)
        resolve (hashHex.toLowerCase());
        })
        

    }
    buildAuthorizationString(strSignature) {
        return (this.HMACAlgorithm + " " + "Credential=" + this.access_key + "/" + this.getDate () + "/" + this.regionName +"/" + this.serviceName +"/" +this.aws4Request + "," + "SignedHeaders=" + this.strSignedHeader + "," + "Signature=" + strSignature)
    }

    async prepareStringToSign(canonicalURL) {
        return new Promise(async(resolve, reject) => {
            let stringToSign = '';
        stringToSign += this.HMACAlgorithm + "\n";
        stringToSign += this.xAmzDate + "\n";
        stringToSign +=`${this.currentDate}/${this.regionName}/${this.serviceName}/
        ${this.aws4Request}\n`
        stringToSign += await this.generateHex ( canonicalURL );
        resolve (stringToSign);
        })
        
    }

    async calculateSignature(stringToSign) {
        
        return new Promise(async(resolve, reject) => {
            let signatureKey = await this.getSignatureKey ( this.secret_key, this.currentDate, this.regionName, this.serviceName );
            console.log(signatureKey);
            //999
            // signature = hash_hmac ( "sha256", stringToSign, signatureKey, true );
            let signature = await calculateHMAC(stringToSign, signatureKey)
            // console.log(signature);
           
            //99
            // strHexSignature = strtolower ( bin2hex ( signature ) );
            let strHexSignature = binToHex ( signature ).toLowerCase();
            
            resolve (strHexSignature); 
        })
        //999
        
    }
    
    async getSignatureKey(key, date, regionName, serviceName) {
        
        return new Promise(async(resolve, reject) => {
            const kSecret = "AWS4"+key;
            
        //999
        // const kDate = hash_hmac ( "sha256", date, kSecret, true );
        // const kRegion = hash_hmac ( "sha256", regionName, kDate, true );
        // const kService = hash_hmac ( "sha256", serviceName, kRegion, true );
        // const kSigning = hash_hmac ( "sha256", this.aws4Request, kService, true );
        const kDate = await calculateHMAC (date, kSecret );
       
        const kRegion = await calculateHMAC (regionName, kDate );
        
        
        const kService = await calculateHMAC (serviceName, kRegion );
    
        const kSigning = await calculateHMAC (this.aws4Request, kService );
        
        resolve (kSigning);
        })
        
    }
    getTimeStamp() {
        return (new Date().toISOString().replace(/[-:]/g, '').slice(0, -5) + 'Z')
    }
    getDate() {
        return (new Date().toISOString().slice(0, 10).replace(/-/g, ''))
    }

  }

const fff=async()=>{



const serviceName="ProductAdvertisingAPI";
const region="us-east-1";
const accessKey="AKIAIMD4UKXZRFQONA4A";
const secretKey="TNd+cSHLoKlSZAx1fjNdItFFKjQFeMB5/kgmxn32";


const host="webservices.amazon.com";
const uriPath="/paapi5/getitems";
const awsv4 = new AwsV4 (accessKey, secretKey);
awsv4.setRegionName(region);
awsv4.setServiceName(serviceName);
awsv4.setPath (uriPath);
awsv4.setPayload (JSON.stringify(jsonPayload));
awsv4.setRequestMethod ("POST");
awsv4.addHeader ('content-encoding', 'amz-1.0');
awsv4.addHeader ('content-type', 'application/json; charset=utf-8');
awsv4.addHeader ('host', host);
awsv4.addHeader ('x-amz-target', 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems');
const headers = await awsv4.getHeaders ();
let headerString = "";
console.log(headers);
console.log(JSON.stringify(jsonPayload));
Object.entries (headers).forEach (([key, value]) =>{
    headerString+=key+": "+value+"\r\n"
})
console.log(headerString);
const url = `https://${host}${uriPath}`;

// console.log(url,'vvv',headers,'vvv',headerString);


const runApi=(accessKey,secretKey)=>{
    // const params = {
    // method: '',
    // headers: {
    //     'Content-Type': 'application/json', // Adjust the content type as needed
    //     ...headers // Add other headers if available in the PHP version
    // },
    // body: JSON.stringify(payload) // Adjust payload as needed
    // };
    
    
  fetch(url,{
    method:'POST',
    headers:headers,
    body: JSON.stringify(jsonPayload)
    // headers: {
    //   Host: "webservices.amazon.com",
    //  ' X-Amz-Date': new Date(),
    //   'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems',
    //   'Content-Encoding': 'amz-1.0',
    //   Authorization:`AWS4-HMAC-SHA256 
    //   Credential=AKIAIMD4UKXZRFQONA4A/20231004/us-east-1/ProductAdvertisingAPI/
    //   aws4_request SignedHeaders=content-encoding;host;x-amz-date;x-amz-target  
    //   Signature=a6bf543ce431cc388afe6ae4eba5b94a283d332c6050511c80cf61e37e9771dd`
    // },
  })
  .then(res=>{
    console.log(res);
  })
}
// runApi()

// async function calculateSHA256ToBin(data) {
//     return new Promise(async(resolve, reject) => {
//         const encoder = new TextEncoder();
//         const encodedData = encoder.encode(data);
//         const hashBuffer = await crypto.subtle.digest('SHA-256', encodedData);
//       resolve( new Uint8Array(hashBuffer));
//     })
   
    
//   }



//   async function calculateHMAC(data, kSecret) {
//     const encoder = new TextEncoder();
//     const encodedData = encoder.encode(data);
//     const encodedKey = encoder.encode(kSecret);
  
//     const key = await crypto.subtle.importKey(
//       'raw',
//       encodedKey,
//       { name: 'HMAC', hash: 'SHA-256' },
//       false,
//       ['sign']
//     );
  
//     const signature = await crypto.subtle.sign('HMAC', key, encodedData);
//     return new Uint8Array(signature);
//   }

}

module.exports =fff
