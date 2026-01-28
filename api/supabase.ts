
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fovixlgnxoraxieozxzs.supabase.co";
const supabaseAnonKey = "sb_publishable_D9VoqW6ssJoIoK7_dxjHqw_KqgrdDkD";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
