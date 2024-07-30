<template>
    <div class="text-gray-800">
        <div class="hero h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col items-center justify-center">
                <div class="flex flex-col items-center justify-center text-center">
                    <h1
                        class="text-3xl sm:text-4xl md:text-7xl font-bold font-logo text-gray-800 [text-shadow:_0px_2px_0_rgb(0_0_0_/_40%)]">
                        <span class="text-[#A32035] block sm:inline">MIT</span> <span class="text-nowrap">
                            PROCESSOR DB
                        </span></h1>
                    <p class="text-lg sm:text-xl md:text-2xl">
                        Revealing Technical and Economic Trends in Computer Hardware</p>
                </div>

                <div
                    class="flex flex-col items-center justify-center mt-32 bg-[#A32035] text-white py-4 px-4 md:px-8 rounded-full text-sm sm:text-base">
                    <p class="font-bold">COMING SOON</p>
                    <p class="uppercase">Launching Late 2024 to Early 2025!</p>
                </div>
            </div>
        </div>
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32 mb-16">
            <section>
                <h2 class="text-3xl font-medium text-gray-600 sm:text-4xl">About</h2>
                <p class="text-lg text-left leading-loose mt-4">
                    We are an interdisciplinary research team dedicated to creating the most comprehensive database of
                    hardware chips, encompassing CPUs, GPUs, FPGAs, and other domain-specific chips from around the
                    globe. Our goal is to track and analyze trends in hardware development comprehensively. We
                    appreciate your feedback, which is vital for maintaining and enhancing the quality of our vibrant
                    and esteemed community!
                </p>
            </section>
            <section>
                <h2 class="text-3xl font-medium text-gray-600 sm:text-4xl">Team</h2>
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-16 mt-8">
                    <!-- <div class="flex items-center flex-wrap justify-center mt-16 gap-x-64 gap-y-16"> -->
                    <div v-for="(member, index) in team" :key="index">
                        <div class="flex flex-col items-center justify-center">
                            <img :src="member.image" class="object-cover object-top w-32 h-32 rounded-full" alt="team member">
                            <p class="font-medium text-gray-700 text-center mt-4">{{ member.name }}</p>
                            <p class="text-xs text-gray-700 text-nowrap">{{ member.affiliation }}</p>
                        </div>
                    </div>

                </div>
            </section>
            <section>
                <h2 class="text-3xl font-medium text-gray-600 sm:text-4xl">Steering committee</h2>
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-16 mt-8">
                    <!-- <div class="flex items-center flex-wrap justify-center mt-16"> -->
                    <div v-for="(member, index) in steeringCommittee" :key="index">
                        <div class="flex flex-col items-center justify-center">
                            <img :src="member.image" class="object-cover object-top w-32 h-32 rounded-full" alt="team member">
                            <p class="font-medium text-gray-700 text-center mt-4">{{ member.name }}</p>
                            <p class="text-xs text-gray-700 text-nowrap">{{ member.affiliation }}</p>
                        </div>
                    </div>

                </div>
            </section>
            <section>
                <h2 class="text-3xl font-medium text-gray-600 sm:text-4xl">Collaborators</h2>
                <div
                    class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-16 mt-8 place-content-center place-items-center">
                    <a href="https://futuretech.mit.edu/" target="_blank" aria-label="MIT Futuretech"><img
                            src="/mitfuturetechlogo.png" class="max-h-[200px]" alt="team member"></a>
                    <a href="https://www.koomey.com/analyticspage.html" target="_blank"
                        aria-label="Koomey Analytics"><img src="/koomeyanalyticslogo.png" class="max-h-[200px]"
                            alt="team member"></a>

                </div>
            </section>
        </main>
        <footer class="bg-black border-t-[12px] border-t-[#A32035] text-center text-white py-8 px-4 sm:px-6 lg:px-8 ">
            <div class="max-w-7xl mx-auto flex justify-between flex-col gap-8 lg:flex-row flex-wrap">
                <div class="text-left">
                    <h2 class="text-2xl font-bold font-logo"><span class="text-[#A32035]">MIT</span> <span
                            class="text-nowrap">PROCESSOR DB</span></h2>
                    <p class="text-sm">
                        Revealing Technical and Economic Trends in Computer Hardware</p>
                </div>
                <div class="flex justify-between text-left flex-col gap-8 lg:gap-32 lg:flex-row  ">
                    <div>
                        <h2 class="font-medium text-md">Relevant links</h2>
                        <ul class="font-light text-sm space-y-2 mt-2">
                            <li><a class="hover:underline py-2" href="https://futuretech.mit.edu/" target="_blank"
                                    aria-label="MIT Futuretech">MIT
                                    Futuretech</a></li>
                            <li><a class="hover:underline py-2" href="https://www.koomey.com/analyticspage.html"
                                    target="_blank" aria-label="Koomey Analytics">Koomey Analytics</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="font-medium text-md">Data sources</h3>
                        <ul class="font-light text-sm space-y-2 mt-2">
                            <li><a class="hover:underline py-2" href="http://cpudb.stanford.edu/" target="_blank"
                                    aria-label="Stanford CPU DB">Stanford
                                    CPU DB</a></li>
                            <li><a class="hover:underline py-2" href="https://chip-dataset.vercel.app/" target="_blank"
                                    aria-label="The CHIP Dataset">The
                                    CHIP Dataset</a></li>
                            <li><a class="hover:underline py-2" href="https://www.techpowerup.com/cpu-specs/"
                                    target="_blank" aria-label="TechPowerUp">TechPowerUp</a></li>
                            <li><a class="hover:underline py-2" href="https://en.wikichip.org/wiki/WikiChip"
                                    target="_blank" aria-label="TechPowerUp">WikiChip</a></li>
                        </ul>
                    </div>
                    <!-- <div>
                            <h4 class="font-bold text-md">Social</h4>
                            <ul class="font-light text-sm space-y-2 mt-2">
                                <li><a class="hover:underline py-2" href="#">Facebook</a></li>
                                <li><a class="hover:underline py-2" href="#">X</a></li>
                            </ul>
                        </div> -->


                </div>

            </div>
            <div
                class="max-w-7xl mx-auto  border-t border-t-white flex justify-between gap-8 mt-16 pt-8 flex-col sm:flex-row">
                <p class="text-center text-sm">
                    © {{ new Date().getFullYear() }} MIT Processor Database
                </p>
                <p>
                    <a href="https://accessibility.mit.edu/" target="_blank" aria-label="MIT Acessability">
                        Accessibility
                    </a>
                </p>

            </div>
        </footer>
    </div>
</template>

<script setup>
useHead({
    title: 'MIT Processor DB',
    meta: [
        {
            name: 'description', content: 'MIT Processor DB is an interdisciplinary research team \
dedicated to creating the most comprehensive database of hardware chips, encompassing CPUs, GPUs, FPGAs, and other domain-specific chips from around the globe.\
Our goal is to track and analyze trends in hardware development comprehensively' }
    ],
    htmlAttrs: {
        lang: 'en',
    },
})

const team = [
    {
        name: 'Neil Thompson',
        affiliation: 'MIT Futuretech',
        image: '/neil_thompson_hs.jpeg',
    },
    {
        name: 'Jonathan Koomey',
        affiliation: 'Koomey Analytics',
        image: '/koomey_hs.jpg',
    },
    {
        name: 'Sylvia Downing',
        affiliation: 'Sylvility Consulting',
        image: '/sylviaprofile.jpg'
    },
    {
        name: 'Emanuele Del Sozzo',
        affiliation: 'MIT Futuretech',
        image: '/del_sozzo-hs.jpg',
    },
    {
        name: 'Zachary Schmidt',
        affiliation: 'Koomey Analytics',
        image: '/schmidt.png',
    },
    {
        name: 'Rebecca Wenjing Lyu',
        affiliation: 'MIT Futuretech',
        image: '/rebecca_wenjing_hs.jpeg',
    },

]

const steeringCommittee = [
    {
        name: 'Dave Byrne',
        affiliation: 'Federal Reserve Board',
        image: '/byrne.jpeg',
    }, {
        name: 'Eric Masanet',
        affiliation: 'UCSB',
        image: '/Eric-Masanet.jpg',
        description: 'Eric Masanet holds the Mellichamp Chair in Sustainability Science for Emerging Technologies in the Bren School, with a courtesy appointment in the Department of Mechanical Engineering. At UCSB, he leads the Industrial Sustainability Analysis Laboratory, which develops models, datasets, and roadmaps for decarbonizing the industrial and information technology sectors while achieving broader sustainability and equity benefits. He is also a Faculty Scientist in the Energy Analysis & Environmental Impacts Division at Lawrence Berkeley National Laboratory.'
    },
    {
        name: 'Samuel Naffziger',
        affiliation: 'AMD',
        image: '/S_Naffziger_fellow_small.png',
        description: 'Samuel Naffziger is SVP and Corporate Fellow at AMD responsible for technical strategy and product architecture.   He has been the lead innovator behind many of AMD’s low power features and chiplet architecture products.   He has over 35 years of industry experience with a background in microprocessors and circuit design, starting at Hewlett Packard, moving to Intel and then at AMD since 2006.  He received the BSEE from CalTech in 1988 and MSEE from Stanford in 1993 and holds over 150 US patents in the field.  He has authored 100s of publications and presentations on processors, chiplet architecture and power management and is a Fellow of the IEEE.'
    },
    {
        name: 'Eric J. Dahlen',
        affiliation: 'Intel',
        image: '/Eric_Dahlen.jpg',
        description: 'Graduated from Washington State University with a BSEE in 1988.  Spent over 35 years working for Intel Corporation in a variety of roles ranging from CPU design to chipset architecture, to system validation, to server system performance, to Cloud solution architecture and modeling, and culminating with 10 years as the lead Cloud technologist in the server group.  Retired to focus on parenthood and recreation as of August 2024.'
    },

]
</script>


<style scoped>
.hero {
    background-color: white;
    background-position: bottom center;
    background-size: 32rem;
    background-image:
        linear-gradient(to bottom, rgba(255, 255, 255, 0.52) 75%, rgb(255, 255, 255)),
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 304 304' width='304' height='304'%3E%3Cpath fill='%238E8E8E' fill-opacity='0.3' d='M44.1 224a5 5 0 1 1 0 2H0v-2h44.1zm160 48a5 5 0 1 1 0 2H82v-2h122.1zm57.8-46a5 5 0 1 1 0-2H304v2h-42.1zm0 16a5 5 0 1 1 0-2H304v2h-42.1zm6.2-114a5 5 0 1 1 0 2h-86.2a5 5 0 1 1 0-2h86.2zm-256-48a5 5 0 1 1 0 2H0v-2h12.1zm185.8 34a5 5 0 1 1 0-2h86.2a5 5 0 1 1 0 2h-86.2zM258 12.1a5 5 0 1 1-2 0V0h2v12.1zm-64 208a5 5 0 1 1-2 0v-54.2a5 5 0 1 1 2 0v54.2zm48-198.2V80h62v2h-64V21.9a5 5 0 1 1 2 0zm16 16V64h46v2h-48V37.9a5 5 0 1 1 2 0zm-128 96V208h16v12.1a5 5 0 1 1-2 0V210h-16v-76.1a5 5 0 1 1 2 0zm-5.9-21.9a5 5 0 1 1 0 2H114v48H85.9a5 5 0 1 1 0-2H112v-48h12.1zm-6.2 130a5 5 0 1 1 0-2H176v-74.1a5 5 0 1 1 2 0V242h-60.1zm-16-64a5 5 0 1 1 0-2H114v48h10.1a5 5 0 1 1 0 2H112v-48h-10.1zM66 284.1a5 5 0 1 1-2 0V274H50v30h-2v-32h18v12.1zM236.1 176a5 5 0 1 1 0 2H226v94h48v32h-2v-30h-48v-98h12.1zm25.8-30a5 5 0 1 1 0-2H274v44.1a5 5 0 1 1-2 0V146h-10.1zm-64 96a5 5 0 1 1 0-2H208v-80h16v-14h-42.1a5 5 0 1 1 0-2H226v18h-16v80h-12.1zm86.2-210a5 5 0 1 1 0 2H272V0h2v32h10.1zM98 101.9V146H53.9a5 5 0 1 1 0-2H96v-42.1a5 5 0 1 1 2 0zM53.9 34a5 5 0 1 1 0-2H80V0h2v34H53.9zm60.1 3.9V66H82v64H69.9a5 5 0 1 1 0-2H80V64h32V37.9a5 5 0 1 1 2 0zM101.9 82a5 5 0 1 1 0-2H128V37.9a5 5 0 1 1 2 0V82h-28.1zm16-64a5 5 0 1 1 0-2H146v44.1a5 5 0 1 1-2 0V18h-26.1zm102.2 270a5 5 0 1 1 0 2H98v14h-2v-16h124.1zM242 149.9V160h16v34h-16v62h48v48h-2v-46h-48v-66h16v-30h-16v-12.1a5 5 0 1 1 2 0zM53.9 18a5 5 0 1 1 0-2H64V2H48V0h18v18H53.9zm112 32a5 5 0 1 1 0-2H192V0h50v2h-48v48h-28.1zm-48-48a5 5 0 0 1-9.8-2h2.07a3 3 0 1 0 5.66 0H178v34h-18V21.9a5 5 0 1 1 2 0V32h14V2h-58.1zm0 96a5 5 0 1 1 0-2H137l32-32h39V21.9a5 5 0 1 1 2 0V66h-40.17l-32 32H117.9zm28.1 90.1a5 5 0 1 1-2 0v-76.51L175.59 80H224V21.9a5 5 0 1 1 2 0V82h-49.59L146 112.41v75.69zm16 32a5 5 0 1 1-2 0v-99.51L184.59 96H300.1a5 5 0 0 1 3.9-3.9v2.07a3 3 0 0 0 0 5.66v2.07a5 5 0 0 1-3.9-3.9H185.41L162 121.41v98.69zm-144-64a5 5 0 1 1-2 0v-3.51l48-48V48h32V0h2v50H66v55.41l-48 48v2.69zM50 53.9v43.51l-48 48V208h26.1a5 5 0 1 1 0 2H0v-65.41l48-48V53.9a5 5 0 1 1 2 0zm-16 16V89.41l-34 34v-2.82l32-32V69.9a5 5 0 1 1 2 0zM12.1 32a5 5 0 1 1 0 2H9.41L0 43.41V40.6L8.59 32h3.51zm265.8 18a5 5 0 1 1 0-2h18.69l7.41-7.41v2.82L297.41 50H277.9zm-16 160a5 5 0 1 1 0-2H288v-71.41l16-16v2.82l-14 14V210h-28.1zm-208 32a5 5 0 1 1 0-2H64v-22.59L40.59 194H21.9a5 5 0 1 1 0-2H41.41L66 216.59V242H53.9zm150.2 14a5 5 0 1 1 0 2H96v-56.6L56.6 162H37.9a5 5 0 1 1 0-2h19.5L98 200.6V256h106.1zm-150.2 2a5 5 0 1 1 0-2H80v-46.59L48.59 178H21.9a5 5 0 1 1 0-2H49.41L82 208.59V258H53.9zM34 39.8v1.61L9.41 66H0v-2h8.59L32 40.59V0h2v39.8zM2 300.1a5 5 0 0 1 3.9 3.9H3.83A3 3 0 0 0 0 302.17V256h18v48h-2v-46H2v42.1zM34 241v63h-2v-62H0v-2h34v1zM17 18H0v-2h16V0h2v18h-1zm273-2h14v2h-16V0h2v16zm-32 273v15h-2v-14h-14v14h-2v-16h18v1zM0 92.1A5.02 5.02 0 0 1 6 97a5 5 0 0 1-6 4.9v-2.07a3 3 0 1 0 0-5.66V92.1zM80 272h2v32h-2v-32zm37.9 32h-2.07a3 3 0 0 0-5.66 0h-2.07a5 5 0 0 1 9.8 0zM5.9 0A5.02 5.02 0 0 1 0 5.9V3.83A3 3 0 0 0 3.83 0H5.9zm294.2 0h2.07A3 3 0 0 0 304 3.83V5.9a5 5 0 0 1-3.9-5.9zm3.9 300.1v2.07a3 3 0 0 0-1.83 1.83h-2.07a5 5 0 0 1 3.9-3.9zM97 100a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-48 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 48a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 96a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-144a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-96 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm96 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-32 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM49 36a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-32 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM33 68a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-48a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 240a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm80-176a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 48a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm112 176a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 180a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 84a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'%3E%3C/path%3E%3C/svg%3E");
}
</style>