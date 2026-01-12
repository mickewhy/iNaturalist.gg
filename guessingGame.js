const embedWhite = 16777215

async function iNatGame(c) {
    const boneArray = [
        'https://www.inaturalist.org/observations.json/?rank=species&quality_grade=research&term_id=22&term_value_id=27&has[photos]',
        'https://www.inaturalist.org/observations.json/?rank=species&quality_grade=research&project_id=488&has[photos]'
    ]
    const randomLink = boneArray[Math.floor(Math.random() * boneArray.length)]
    var body = null
    await fetch(randomLink).then(res => res.json()).then(b => { body = b })
    // await fetch('https://inaturalist.org/observations.json?list_id=4421960&has[photos]').then(res => res.json()).then(b => { body = b })
    const randomObservation = body[Math.floor(Math.random() * body.length)]
    c.send({
        embeds: [{ "image": { "url": randomObservation.photos[0].medium_url }, "color": embedWhite, "footer": { "text": "Type 'skip' to try a different observation" } }]
    }).then(() => {
        let filter = m => !m.author.bot && m.content.length > 2 && ((randomObservation.taxon.name.toLowerCase().includes(m.content.toLowerCase()) && similarity(m.content.toLowerCase(), randomObservation.taxon.name.toLowerCase()) >= 0.15) || similarity(m.content.toLowerCase(), randomObservation.taxon.name.toLowerCase()) >= 0.7 || m.content.toLowerCase() == "skip")
        c.awaitMessages({ filter, max: 1, time: '60000', errors: ['time'] }).then(collected => {
            if (collected.first().content.toLowerCase() == "skip")
                return c.send({ embeds: [{ "description": "Skipped! The correct answer was **" + randomObservation.taxon.name + "**\n[Observation Link](" + randomObservation.uri + ")", "color": embedWhite }] }).then(iNatGame(c))
            if (collected.first().content.toLowerCase() == randomObservation.taxon.name.toLowerCase())
                return c.send({ embeds: [{ "description": "**<@" + collected.first().member.id + "> guessed the species!**\n + double points for guessing the exact name!\n The correct answer was **" + randomObservation.taxon.name + "**\n[Observation Link](" + randomObservation.uri + ")", "color": embedWhite }] }).then(addPoint(collected.first().author.id, 2))
            return c.send({ embeds: [{ "description": "**<@" + collected.first().member.id + "> guessed the species!**\n The correct answer was **" + randomObservation.taxon.name + "**\n[Observation Link](" + randomObservation.uri + ")", "color": embedWhite }] }).then(addPoint(collected.first().author.id, 1))
        }).catch(collected => {
            return c.send({ embeds: [{ "description": "Timed out! The correct answer was **" + randomObservation.taxon.name + "**\n[Observation Link](" + randomObservation.uri + ")", "color": embedWhite }] })
        })
    })
}

client.on(ShardEvents.Ready, async () => {
    client.application.commands.create({
        name: 'inatgame',
        description: 'Play the iNat Game.',
        defaultMemberPermissions: PermissionFlagsBits.MoveMembers
    })
})

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isCommand()) {
        const { commandName, options } = interaction
        if (commandName === 'inatgame') {
            const boneArray = [
                'https://www.inaturalist.org/observations.json/?rank=species&quality_grade=research&term_id=22&term_value_id=27&has[photos]',
                //'https://www.inaturalist.org/observations.json/?rank=species&quality_grade=research&project_id=488&has[photos]'
            ]
            const randomLink = boneArray[Math.floor(Math.random() * boneArray.length)]
            var body = null
            await fetch(randomLink).then(res => res.json()).then(b => { body = b })
            // await fetch('https://inaturalist.org/observations.json?list_id=4421960&has[photos]').then(res => res.json()).then(b => { body = b })
            const randomObservation = body[Math.floor(Math.random() * body.length)]
            interaction.reply({
                embeds: [{ "image": { "url": randomObservation.photos[0].medium_url }, "color": embedWhite, "footer": { "text": "Type 'skip' to try a different observation" } }]
            }).then(() => {
                let c = interaction.channel
                let filter = m => !m.author.bot && m.content.length > 2 && ((randomObservation.taxon.name.toLowerCase().includes(m.content.toLowerCase()) && similarity(m.content.toLowerCase(), randomObservation.taxon.name.toLowerCase()) >= 0.15) || similarity(m.content.toLowerCase(), randomObservation.taxon.name.toLowerCase()) >= 0.7 || m.content.toLowerCase() == "skip")
                c.awaitMessages({ filter, max: 1, time: '60000', errors: ['time'] }).then(collected => {
                    if (collected.first().content.toLowerCase() == "skip")
                        return c.send({ embeds: [{ "description": "Skipped! The correct answer was **" + randomObservation.taxon.name + "**\n[Observation Link](" + randomObservation.uri + ")", "color": embedWhite }] }).then(iNatGame(c))
                    if (collected.first().content.toLowerCase() == randomObservation.taxon.name.toLowerCase())
                        return c.send({ embeds: [{ "description": "**<@" + collected.first().member.id + "> guessed the species!**\n + double points for guessing the exact name!\n The correct answer was **" + randomObservation.taxon.name + "**\n[Observation Link](" + randomObservation.uri + ")", "color": embedWhite }] }).then(addPoint(collected.first().author.id, 2))
                    return c.send({ embeds: [{ "description": "**<@" + collected.first().member.id + "> guessed the species!**\n The correct answer was **" + randomObservation.taxon.name + "**\n[Observation Link](" + randomObservation.uri + ")", "color": embedWhite }] }).then(addPoint(collected.first().author.id, 1))
                }).catch(collected => {
                    return c.send({ embeds: [{ "description": "Timed out! The correct answer was **" + randomObservation.taxon.name + "**\n[Observation Link](" + randomObservation.uri + ")", "color": embedWhite }] })
                })
            })
        }
    }
})
