



  exports.cParticipant =  (data) => {

    return {
       displayName: data.fullName,
        email: data.email,
        dpUrl: data.dpUrl,
        uid: data._id
    }
  }


  exports.fileNamer = async (data) => {
    let rs = String(data);
    let res = rs.replace(/\s+/g, '');
    console.log('wewe' + res);
    return res;
  }

