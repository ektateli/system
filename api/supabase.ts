import { createClient } from "@supabase/supabase-js";

// Credentials updated based on the provided screenshot
const supabaseUrl = "https://fovixlgnxoraxieozxzs.supabase.co";
const supabaseAnonKey = "sb_publishable_D9VoqW6ssJoIoK7_JoloK7_dxjHqw_KqgrdDkD";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);