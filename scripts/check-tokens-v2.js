const { createClient } = require("@supabase/supabase-js");

const url = "https://ltqrexosyudcntikynua.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0cXJleG9zeXVkY250aWt5bnVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxMjA1MiwiZXhwIjoyMDgzNTg4MDUyfQ.1JvfIjxA5QEY_J45wg8l-OkJfvoWDYzaQ7L7ymWTWts";

const supabase = createClient(url, key);

async function checkTokens() {
    const { data, error } = await supabase.from("access_tokens").select("*");
    if (error) {
        console.error("Error fetching tokens:", error);
    } else {
        console.log("Existing tokens:", JSON.stringify(data, null, 2));
    }
}

checkTokens();
