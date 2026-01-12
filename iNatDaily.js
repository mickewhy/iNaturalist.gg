var aotdInput = ""

async function iNatGeneral(iNatLink, authorName, iNatChannel) {
    var body = null
    if (aotdInput == "")
        await fetch(iNatLink).then(res => res.json()).then(b => { body = b.results })
    else await fetch("https://api.inaturalist.org/v1/observations/?taxon_name=" + aotdInput).then(res => res.json()).then(b => { body = b.results })
    const randomObservation = body[Math.floor(Math.random() * body.length)]
    const pickedLink = "https://inaturalist.org/taxa/" + randomObservation.taxon.id
    try {
        const animalCommon = randomObservation.taxon.preferred_common_name
        const animalScientific = randomObservation.taxon.name
        const animalImage = randomObservation.taxon.default_photo.medium_url
        const embed = new EmbedBuilder()
            .setAuthor({ name: authorName, url: pickedLink })
            .setImage(animalImage)
            .setColor(7712256)
            .setFooter({ text: "Sourced from inaturalist.org", iconURL: "https://static.inaturalist.org/sites/1-favicon.png" })
        if (animalCommon == undefined) embed.setDescription('# *' + animalScientific + '*')
        else embed.setDescription('# ' + animalCommon + '\n*' + animalScientific + '*')
        var isBird = false
        var isSpecies = randomObservation.taxon.rank == "species"
        var isFungi = (authorName == "🍄 Fungi of the Day 🍄")
        var isEdible = edibleFungi.includes(animalScientific) || edibleFungi.includes(animalScientific.substring(0, animalScientific.indexOf(' ')))
        for (i in randomObservation.identifications)
            if (randomObservation.identifications[i].taxon.name == randomObservation.taxon.name) {
                for (j in randomObservation.identifications[i].taxon.ancestors) {
                    let ancestor = randomObservation.identifications[i].taxon.ancestors[j]
                    if (ancestor.rank == "class")
                        if (ancestor.preferred_common_name == undefined)
                            embed.addFields({ name: "Class", value: "*" + ancestor.name + "*", inline: true })
                        else {
                            if (ancestor.name == 'Aves') isBird = true
                            embed.addFields({ name: "Class", value: "**" + ancestor.preferred_common_name + "** (Class *" + ancestor.name + "*)", inline: true })
                        }
                    if (ancestor.rank == "order")
                        if (ancestor.preferred_common_name == undefined)
                            embed.addFields({ name: "Order", value: "*" + ancestor.name + "*", inline: true })
                        else
                            embed.addFields({ name: "Order", value: "**" + ancestor.preferred_common_name + "** (Order *" + ancestor.name + "*)", inline: true })
                    if (ancestor.rank == "family")
                        if (ancestor.preferred_common_name == undefined)
                            embed.addFields({ name: "Family", value: "*" + ancestor.name + "*", inline: true })
                        else
                            embed.addFields({ name: "Family", value: "**" + ancestor.preferred_common_name + "** (Family *" + ancestor.name + "*)", inline: true })
                }
                break
            }
        embed.addFields({ name: "Total Observations", value: randomObservation.taxon.observations_count + "", inline: true })
        embed.addFields({ name: "Source", value: `[Click Me!](${pickedLink})`, inline: true })
        if (isFungi)
            embed.addFields({ name: "Edibility", value: `[Click Me!](https://en.wikipedia.org/wiki/Edible_mushroom)`, inline: true })

        let row
        if (isBird && isSpecies) {
            row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('featherbase')
                        .setURL('https://www.featherbase.info/nb/species/' + randomObservation.taxon.name.replace(' ', '/'))
                        .setStyle(ButtonStyle.Link)
                        .setEmoji('🪶')
                )
        }
        // if (isFungi) {
        //     if (isEdible)
        //         row = new ActionRowBuilder()
        //             .addComponents(
        //                 new ButtonBuilder()
        //                     .setLabel('Edible')
        //                     .setStyle(ButtonStyle.Success)
        //                     .setEmoji('🍄')
        //                     .setCustomId('doNothing')
        //             )
        //     else
        //         row = new ActionRowBuilder()
        //             .addComponents(
        //                 new ButtonBuilder()
        //                     .setLabel('Inedible')
        //                     .setStyle(ButtonStyle.Danger)
        //                     .setEmoji('🍄')
        //                     .setCustomId('doNothing')
        //             )
        // }
        returnValue = null
        if (row != null)
            returnValue = { embeds: [embed], components: [row] }
        else returnValue = { embeds: [embed] }

        if (aotdInput == "")
            return client.channels.cache.get(iNatChannel).send(returnValue)
        else
            return returnValue
    }
    catch (err) {
        if (aotdInput == "") {
            console.log(err.stack + '\n' + pickedLink)
            return setTimeout(function () { iNatGeneral(iNatLink, authorName, iNatChannel) }, 1000 * 60 * 60)
        }
    }

}

async function animalOfTheDay() {
    const links = [
        "https://api.inaturalist.org/v1/observations?taxon_id=355675&rank=species", // Vertebrates
        "https://api.inaturalist.org/v1/observations?taxon_id=40151&rank=species", // Mammals
        "https://api.inaturalist.org/v1/observations?taxon_id=1&rank=species", // Animals
    ]
    iNatGeneral(links[Math.floor(Math.random() * links.length)], "🐾 Animal of the Day 🐾", aotdChannel)
}

async function plantOfTheDay() {
    iNatGeneral("https://api.inaturalist.org/v1/observations?taxon_id=47126&rank=species", "🌱 Plant of the Day 🌱", potdChannel)
}

async function fungiOfTheDay() {
    iNatGeneral("https://api.inaturalist.org/v1/observations?taxon_id=47170&rank=species", "🍄 Fungi of the Day 🍄", fotdChannel)
}

async function batOfTheDay() {
    iNatGeneral("https://api.inaturalist.org/v1/observations?taxon_id=40268&rank=species", "🦇 Bat of the Day 🦇", botdChannel)
}

client.on(ShardEvents.Ready, async () => {
    var now = new Date()
    var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0, 0) - now
    if (millisTill10 < 0) millisTill10 += 86400000
    
    setTimeout(function () { animalOfTheDay() }, millisTill10)
    setTimeout(function () { plantOfTheDay() }, millisTill10)
    setTimeout(function () { fungiOfTheDay() }, millisTill10)
    setTimeout(function () { batOfTheDay() }, millisTill10)
})
