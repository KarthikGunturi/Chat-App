var stompClient=null



function sendMessage(){

    let jsonOb={
        name:localStorage.getItem("name"),
        content:$("#message-value").val()
    }

    stompClient.send("/app/message",{},JSON.stringify(jsonOb));
}



function connect()
{

    let socket=new SockJS("/server1")

    stompClient=Stomp.over(socket)

    stompClient.connect({},function(frame){

        console.log("Connected : "+frame)

        $("#name-from").addClass('d-none')
        $("#chat-room").removeClass('d-none')


        //subscribe
        stompClient.subscribe("/topic/return-to",function(response){

            showMessage(JSON.parse(response.body))

        })



    })

}


function showMessage(message)
{

    $("#message-container-table").prepend(`<tr><td><b>${message.name} :</b> ${message.content}</td></tr>`)

}




$(document).ready((e)=>{


    $("#login").click(()=>{
        let name=$("#name-value").val()
        localStorage.setItem("name",name)
        $("#name-title").html(`Welcome , <b>${name} </b>`)
        connect();
    })

        const inputname = document.getElementById("name-value");

// Execute a function when the user presses a key on the keyboard
        inputname.addEventListener("keypress", function(event) {
            // If the user presses the "Enter" key on the keyboard
            if (event.key === "Enter") {
                // Cancel the default action, if needed
                // event.preventDefault();
                // Trigger the button element with a click
                document.getElementById("login").click();
            }
        });



    $("#send-btn").click(()=>{
        sendMessage()
        const firstNameInput = document.getElementById('message-value');
        firstNameInput.value=''
    })




    $("#logout").click(()=>{

        localStorage.removeItem("name")
        if(stompClient!==null)
        {
            stompClient.disconnect()

            $("#name-from").removeClass('d-none')
            $("#chat-room").addClass('d-none')
            console.log(stompClient)
        }

    })

        const input = document.getElementById("message-value");

// Execute a function when the user presses a key on the keyboard
        input.addEventListener("keypress", function(event) {
            // If the user presses the "Enter" key on the keyboard
            if (event.key === "Enter") {
                // Cancel the default action, if needed
                // event.preventDefault();
                // Trigger the button element with a click
                document.getElementById("send-btn").click();


            }
        });



}
)