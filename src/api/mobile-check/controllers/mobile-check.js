module.exports = {
  async check(ctx) {
    try {
      const { mobile } = ctx.request.body;

      if (!mobile) {
        return ctx.badRequest("Mobile number is required");
      }

      const records = await strapi.db
        .query("api::registration-page.registration-page")
        .findMany({
          where: {
            $or: [
              { personal_information: { mobile_number: mobile } },
              { family_details: { father_mobile: mobile } },
              { family_details: { mother_mobile: mobile } },
              { family_details: { spouse_mobile: mobile } },
              { family_details: { siblingDetails: { phone_number: mobile } } },
              { child_name: { phone_number: mobile } } 
            ],
          },
          populate: {
            personal_information: true,
            family_details: { populate: ["siblingDetails"] },
            child_name: true 
          },
        });

      if (records && records.length > 0) {
     
        const mainProfile = records.find(
          (r) => r.personal_information?.mobile_number === mobile
        );

        if (mainProfile) {
         
          return ctx.send({
            matchFound: false
          });
        }

     
        const record = records[0];
        const role = getRole(record.family_details, record.child_name, mobile);

        return ctx.send({
          matchFound: true,
          mainProfileId: record.id,
          role,
          familyData: record,
        });
      }

   
      return ctx.send({
        matchFound: false,
      });
    } catch (err) {
      console.error("Mobile check error:", err);
      return ctx.send({
        matchFound: false,
        error: "Internal server error",
      });
    }
  },
};


function getRole(familyDetails, children = [], mobile) {
  if (familyDetails.father_mobile === mobile) return "father";
  if (familyDetails.mother_mobile === mobile) return "mother";
  if (familyDetails.spouse_mobile === mobile) return "spouse";
  const sibling = familyDetails?.siblingDetails?.find(
    (s) => s.phone_number === mobile
  );
  if (sibling) return `sibling (${s.sibling_relation})`;

  const child = children?.find(
    (c) => c.phone_number === mobile
  );
  if (child) return "child";

  return "family member";
}


