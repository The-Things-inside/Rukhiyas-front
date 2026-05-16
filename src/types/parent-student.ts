/** Parent-app student record from GET /students/me */
export type ParentStudent = {
  id: number;
  full_name: string;
  profile_picture_url: string | null;
  bus_id: number | null;
  student_address: string;
  temp_address: string | null;
  temp_pick_address?: string | null;
  temp_drop_address?: string | null;
  temp_dates?: string[];
  approximate_fees: number | null;
  actual_fees: number | null;
  fee_expiry: string | null;
  is_paid: boolean;
};
