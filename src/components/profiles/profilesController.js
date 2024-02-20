module.exports = {

  async findAll(req, res) {
    const { Profile } = req.app.get('models');
    const profiles = await Profile.findAll();

    return res.json(profiles);
  },

  async findOne(req, res) {
    const { Profile } = req.app.get('models');
    const profile = await Profile.findOne({
      where: {
        id: +req.params.profileId,
      },
    });

    if (!profile) {
      return res.status(404).end();
    }

    return res.json(profile);
  },

};
