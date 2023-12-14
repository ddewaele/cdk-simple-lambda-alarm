export const handler = async (event) => {
    console.log("Event = " + JSON.stringify(event));
    if (event.error) {
        throw new Error("Lambda goes into error")
    } else {
        console.log("All good")
    }
}
