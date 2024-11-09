export default defineCachedEventHandler(async (event) => {
    const { data } = await $fetch('https://processordb.mit.edu/backend/api/socs')
    return data
},
{
    maxAge: 60,
    swr: 60,
}
)