myTodoApp.service('progressService',function () {

    //some context variable
    this.self = this;
    this.done = 1;
    this.pending =1;

    //returns length of total totalTasks
    this.totalTasks =   function(){
        var x= JSON.parse(localStorage.getItem('db'));
        return x.data.length;
    }


    //returns the object containing pending tasks
    this.pendingTask = function () {
        var x= JSON.parse(localStorage.getItem('db'));

        //get all the keys of the taks
        var keys =[];
        for(var i=0;i<x.data.length;i++)
            keys.push(x.data[i].taskKey);

        //get the task type for each key
        var allTypes = JSON.parse(localStorage.getItem('db')).taskType;
        console.warn(allTypes[0]);
        console.warn(keys);
        console.log("search result ");
        self.lists = [];

        //get the list of the keys having pending type i.e false
        for(var i=0;i<keys.length; i++)
        {
            //search for the keys having false type
            var item =mySearch(keys[i],allTypes,"false");
            //if its found
            if(item===true) //put it into the list
                self.lists.push(keys[i]);

        }

        self.listItems =[];

        self.db = JSON.parse(localStorage.getItem('db'));

        //for each false keys we create the object containing the item,its key, angg its type
        for(var i=0;i<self.lists.length;i++)
        {
            self.listItems.push({"item" : [localStorage.getItem(self.lists[i])],
                                "key" : [self.lists[i]],
                                'type' : [searchTaskType(self.lists[i],self.db.taskType)]});
        }

        return self.listItems;
    }

    this.completedTask = function () {

    }

    //fucntion, when taskmark as done
    this.clickMarked =  function (item) {

        self.db = JSON.parse(localStorage.getItem('db'));
        //  console.log($scope.db.taskType);
        //search the taskType by its id and put its type as true
        self.db.taskType[searchItemIndex(item,$scope.db.taskType)] = {[item] : "true"};
        console.log(self.db.taskType[searchItemIndex(item,self.db.taskType)]);
        localStorage.setItem('db',JSON.stringify(self.db));


    }

    //when task is deleted
    this.clickDelete=function(item)
    {

        self.db = JSON.parse(localStorage.getItem('db'));
        //find the index of the currrent item delete its key
        self.db.data.splice(searchDataItemIndex(item,self.db.data),1);
        //find the indexx of current item and delete is type
        self.db.taskType.splice(searchItemIndex(item,self.db.taskType),1);
        //remove the item from localStorage
        localStorage.removeItem(item);
        //reset the localStorage
        localStorage.setItem('db',JSON.stringify(self.db));

    }


    this.clickEdit =  function (item,newValue) {

        localStorage.setItem(item,newValue);
    }


});
