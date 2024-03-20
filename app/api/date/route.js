export async function GET(){
    try{
        const serverDate = new Date();
        return Response.json(serverDate);
    }catch(error){
        return Response.json({ error });
    }
}