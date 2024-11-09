export default defineCachedEventHandler(async (event) => {
    const { data } = await $fetch('http://localhost:3001/api/socs')
    return data
},
{
    maxAge: 60,
    swr: 60,
}
)