const Member = require('../models/Member');
const Family = require('../models/Family');
const Firm = require('../models/Firm');

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const getStats = async () => {
  const today = startOfToday();

  const [todaysMembers, todaysFamilies, todaysFirms, totalMembers, totalFamilies, totalFirms] =
    await Promise.all([
      Member.countDocuments({ createdAt: { $gte: today } }),
      Family.countDocuments({ createdAt: { $gte: today } }),
      Firm.countDocuments({ createdAt: { $gte: today } }),
      Member.countDocuments(),
      Family.countDocuments(),
      Firm.countDocuments(),
    ]);

  return {
    todaysAdded: todaysMembers + todaysFamilies + todaysFirms,
    totalMembers,
    totalFamilies,
    totalFirms,
  };
};

module.exports = {
  getStats,
};
