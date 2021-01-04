exports.getChatName = (data, id) => {
    let arr = [];
     data.chatName.forEach(a => {
     a.uid === 'default' && data.isGroup ?  arr.push({ uid: a.uid, chatName: a.fullName, dpUrl: a.dpUrl }) : 
     String(a.uid) !== String(id) && !data.isGroup && arr.push({ uid: a.uid, chatName: a.fullName, dpUrl: a.dpUrl })

    });

    let chatName = arr[0] ? arr[0] : {};
    // console.log(chatName)
    return chatName
  }

  exports.getTimestamp = (data, id) => {
    let dt = data.conversation[0];
    let timestamp = dt ? dt.timestamp : data.timestamp;
    return timestamp
  }


  exports.getMembers = (data, id) => {
    let arr = []; 




    data.forEach(a => {
     let mm = a.members.findIndex(ab => String(ab.uid) === String(id));
    //  console.log(mm)
    let obj = {}
      obj = a;
      if(mm !== -1){
        obj.conversation ? 
        () => {
          obj.conversation.sort((ab, aa) => {
          return (aa.timestamp < ab.timestamp) ? - 1 : ((aa.timestamp > ab.timestamp) ? 1 : 0);
      });
    } : 

        arr.push(a);
      }
    })

    

    // console.log(obj)
    // console.log(obj)
    return arr
  }


  exports.findConvo = (data, id) => {
    let arr = [];
    data.forEach(a => {
      a.members.forEach(ab => {
        if(String(ab.uid) === String(id)) {
          arr.push(a); 
        }
      })
    })
  return arr
  }

  exports.findConvoMembers = (data, id) => {
    let arr = [];
    data.forEach(a => {
      a.members.forEach(ab => {
        if(String(ab.uid) === String(id)) {
          arr.push(a); 
        }
      })
    })
  return arr
}

const clone = (obj) => Object.assign({}, obj);

exports.renameKey = (object, key, newKey) => {

  const clonedObj = clone(object);

  const targetKey = clonedObj[key];



  delete clonedObj[key];

  clonedObj[newKey] = targetKey;

  return clonedObj;

};