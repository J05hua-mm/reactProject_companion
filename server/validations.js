// validation for registering

export function validation(input,min,max,type) {
   
    if(isEmpty(input)) {
     return {passed:false,message:"Field must not be left blank."};
    }
    else if(typeof(input) !== type) {
     return {passed:false,message:"Invalid data type provided"};
    }
    else if(input.length > max || input.length < min) {
     return {passed:false,message:"The input is too short or too long"};
    }
    else {
     return {passed:true};
    }
 }

 export function validation2(input,min,max,type) {
   
   if(typeof(input) !== type) {
   return {passed:false,message:"Invalid data type provided"};
  }
  else if(input.length > max || input.length < min) {
   return {passed:false,message:"The input is too short or too long"};
  }
  else {
   return {passed:true};
  }

}
 
 export function isEmpty(value) {
     if (value == null) return true; // null or undefined
     if (typeof value === "string" || Array.isArray(value)) return value.length === 0;
     if (typeof value === "object") return Object.keys(value).length === 0;
     return false;
   }
 
 export function isValidEmail(email) {
     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     return regex.test(email);
   }

   export function dataKeymatch(data,clientData) {
    return data.every(key => Object.hasOwn(clientData,key));
   }

   