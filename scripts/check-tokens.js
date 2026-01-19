const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env.local") });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkTokens() {
    const { data, error } = await supabase.from("access_tokens").select("*");
    if (error) {
        console.error("Error fetching tokens:", error);
    } else {
        console.log("Existing tokens:", JSON.stringify(data, null, 2));
    }
}

checkTokens();
