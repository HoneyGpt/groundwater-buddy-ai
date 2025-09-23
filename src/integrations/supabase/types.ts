export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      assessment_units: {
        Row: {
          created_at: string
          district_id: string
          id: string
          name: string
          unit_type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          district_id: string
          id?: string
          name: string
          unit_type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          district_id?: string
          id?: string
          name?: string
          unit_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_units_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      conservation_tips: {
        Row: {
          applicable_locations: string[] | null
          category: string
          cost_range: string | null
          created_at: string
          description: string
          difficulty_level: string | null
          expected_impact: string | null
          id: string
          implementation_steps: string[] | null
          search_vector: unknown | null
          seasonal_relevance: string[] | null
          source_document: string | null
          title: string
          updated_at: string
        }
        Insert: {
          applicable_locations?: string[] | null
          category: string
          cost_range?: string | null
          created_at?: string
          description: string
          difficulty_level?: string | null
          expected_impact?: string | null
          id?: string
          implementation_steps?: string[] | null
          search_vector?: unknown | null
          seasonal_relevance?: string[] | null
          source_document?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          applicable_locations?: string[] | null
          category?: string
          cost_range?: string | null
          created_at?: string
          description?: string
          difficulty_level?: string | null
          expected_impact?: string | null
          id?: string
          implementation_steps?: string[] | null
          search_vector?: unknown | null
          seasonal_relevance?: string[] | null
          source_document?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      districts: {
        Row: {
          code: string | null
          created_at: string
          id: string
          name: string
          state_id: string
          updated_at: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: string
          name: string
          state_id: string
          updated_at?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: string
          name?: string
          state_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "districts_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      government_schemes: {
        Row: {
          applicable_states: string[] | null
          application_deadline: string | null
          application_process: string | null
          budget_allocation: number | null
          contact_info: string | null
          created_at: string
          description: string
          eligibility_criteria: string | null
          id: string
          is_active: boolean | null
          launch_date: string | null
          ministry: string
          official_website: string | null
          scheme_name: string
          scheme_type: string | null
          search_vector: unknown | null
          state_specific: boolean | null
          updated_at: string
        }
        Insert: {
          applicable_states?: string[] | null
          application_deadline?: string | null
          application_process?: string | null
          budget_allocation?: number | null
          contact_info?: string | null
          created_at?: string
          description: string
          eligibility_criteria?: string | null
          id?: string
          is_active?: boolean | null
          launch_date?: string | null
          ministry: string
          official_website?: string | null
          scheme_name: string
          scheme_type?: string | null
          search_vector?: unknown | null
          state_specific?: boolean | null
          updated_at?: string
        }
        Update: {
          applicable_states?: string[] | null
          application_deadline?: string | null
          application_process?: string | null
          budget_allocation?: number | null
          contact_info?: string | null
          created_at?: string
          description?: string
          eligibility_criteria?: string | null
          id?: string
          is_active?: boolean | null
          launch_date?: string | null
          ministry?: string
          official_website?: string | null
          scheme_name?: string
          scheme_type?: string | null
          search_vector?: unknown | null
          state_specific?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      groundwater_alerts: {
        Row: {
          alert_type: string
          assessment_unit_id: string | null
          created_at: string
          district_id: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          message: string
          severity_level: number | null
          state_id: string | null
        }
        Insert: {
          alert_type: string
          assessment_unit_id?: string | null
          created_at?: string
          district_id?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          message: string
          severity_level?: number | null
          state_id?: string | null
        }
        Update: {
          alert_type?: string
          assessment_unit_id?: string | null
          created_at?: string
          district_id?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          message?: string
          severity_level?: number | null
          state_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groundwater_alerts_assessment_unit_id_fkey"
            columns: ["assessment_unit_id"]
            isOneToOne: false
            referencedRelation: "assessment_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groundwater_alerts_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groundwater_alerts_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      groundwater_assessments: {
        Row: {
          additional_potential_resources_ham: number | null
          annual_extractable_resource_ham: number | null
          assessment_unit_id: string | null
          assessment_year: string
          base_flow_ham: number | null
          canal_recharge_ham: number | null
          confined_groundwater_resources_ham: number | null
          conservation_structure_recharge_ham: number | null
          created_at: string
          district_id: string
          domestic_allocation_2025_ham: number | null
          domestic_extraction_ham: number | null
          environmental_flows_ham: number | null
          evaporation_ham: number | null
          evapotranspiration_ham: number | null
          flood_prone: boolean | null
          groundwater_irrigation_recharge_ham: number | null
          hilly_area_ha: number | null
          id: string
          industrial_extraction_ham: number | null
          irrigation_extraction_ham: number | null
          is_coastal_area: boolean | null
          lateral_flows_ham: number | null
          net_annual_availability_ham: number | null
          pipeline_recharge_ham: number | null
          quality_critical: boolean | null
          quality_over_exploited: boolean | null
          quality_safe: boolean | null
          quality_semi_critical: boolean | null
          rainfall_mm: number | null
          rainfall_recharge_ham: number | null
          recharge_worthy_area_ha: number | null
          semi_confined_groundwater_resources_ham: number | null
          serial_number: number | null
          sewage_flood_recharge_ham: number | null
          shallow_water_table: boolean | null
          spring_discharge: boolean | null
          stage_of_extraction_percent: number | null
          state_id: string
          stream_recharge_ham: number | null
          surface_irrigation_recharge_ham: number | null
          tanks_ponds_recharge_ham: number | null
          total_annual_recharge_ham: number | null
          total_extraction_ham: number | null
          total_geographical_area_ha: number | null
          total_groundwater_availability_ham: number | null
          transpiration_ham: number | null
          unconfined_groundwater_resources_ham: number | null
          updated_at: string
          vertical_flows_ham: number | null
          waterlogged_area: boolean | null
        }
        Insert: {
          additional_potential_resources_ham?: number | null
          annual_extractable_resource_ham?: number | null
          assessment_unit_id?: string | null
          assessment_year?: string
          base_flow_ham?: number | null
          canal_recharge_ham?: number | null
          confined_groundwater_resources_ham?: number | null
          conservation_structure_recharge_ham?: number | null
          created_at?: string
          district_id: string
          domestic_allocation_2025_ham?: number | null
          domestic_extraction_ham?: number | null
          environmental_flows_ham?: number | null
          evaporation_ham?: number | null
          evapotranspiration_ham?: number | null
          flood_prone?: boolean | null
          groundwater_irrigation_recharge_ham?: number | null
          hilly_area_ha?: number | null
          id?: string
          industrial_extraction_ham?: number | null
          irrigation_extraction_ham?: number | null
          is_coastal_area?: boolean | null
          lateral_flows_ham?: number | null
          net_annual_availability_ham?: number | null
          pipeline_recharge_ham?: number | null
          quality_critical?: boolean | null
          quality_over_exploited?: boolean | null
          quality_safe?: boolean | null
          quality_semi_critical?: boolean | null
          rainfall_mm?: number | null
          rainfall_recharge_ham?: number | null
          recharge_worthy_area_ha?: number | null
          semi_confined_groundwater_resources_ham?: number | null
          serial_number?: number | null
          sewage_flood_recharge_ham?: number | null
          shallow_water_table?: boolean | null
          spring_discharge?: boolean | null
          stage_of_extraction_percent?: number | null
          state_id: string
          stream_recharge_ham?: number | null
          surface_irrigation_recharge_ham?: number | null
          tanks_ponds_recharge_ham?: number | null
          total_annual_recharge_ham?: number | null
          total_extraction_ham?: number | null
          total_geographical_area_ha?: number | null
          total_groundwater_availability_ham?: number | null
          transpiration_ham?: number | null
          unconfined_groundwater_resources_ham?: number | null
          updated_at?: string
          vertical_flows_ham?: number | null
          waterlogged_area?: boolean | null
        }
        Update: {
          additional_potential_resources_ham?: number | null
          annual_extractable_resource_ham?: number | null
          assessment_unit_id?: string | null
          assessment_year?: string
          base_flow_ham?: number | null
          canal_recharge_ham?: number | null
          confined_groundwater_resources_ham?: number | null
          conservation_structure_recharge_ham?: number | null
          created_at?: string
          district_id?: string
          domestic_allocation_2025_ham?: number | null
          domestic_extraction_ham?: number | null
          environmental_flows_ham?: number | null
          evaporation_ham?: number | null
          evapotranspiration_ham?: number | null
          flood_prone?: boolean | null
          groundwater_irrigation_recharge_ham?: number | null
          hilly_area_ha?: number | null
          id?: string
          industrial_extraction_ham?: number | null
          irrigation_extraction_ham?: number | null
          is_coastal_area?: boolean | null
          lateral_flows_ham?: number | null
          net_annual_availability_ham?: number | null
          pipeline_recharge_ham?: number | null
          quality_critical?: boolean | null
          quality_over_exploited?: boolean | null
          quality_safe?: boolean | null
          quality_semi_critical?: boolean | null
          rainfall_mm?: number | null
          rainfall_recharge_ham?: number | null
          recharge_worthy_area_ha?: number | null
          semi_confined_groundwater_resources_ham?: number | null
          serial_number?: number | null
          sewage_flood_recharge_ham?: number | null
          shallow_water_table?: boolean | null
          spring_discharge?: boolean | null
          stage_of_extraction_percent?: number | null
          state_id?: string
          stream_recharge_ham?: number | null
          surface_irrigation_recharge_ham?: number | null
          tanks_ponds_recharge_ham?: number | null
          total_annual_recharge_ham?: number | null
          total_extraction_ham?: number | null
          total_geographical_area_ha?: number | null
          total_groundwater_availability_ham?: number | null
          transpiration_ham?: number | null
          unconfined_groundwater_resources_ham?: number | null
          updated_at?: string
          vertical_flows_ham?: number | null
          waterlogged_area?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "groundwater_assessments_assessment_unit_id_fkey"
            columns: ["assessment_unit_id"]
            isOneToOne: false
            referencedRelation: "assessment_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groundwater_assessments_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groundwater_assessments_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      groundwater_schemes: {
        Row: {
          application_deadline: string | null
          budget_allocation: number | null
          contact_number: string | null
          created_at: string
          district_id: string | null
          eligibility_criteria: string | null
          id: string
          is_active: boolean | null
          official_link: string | null
          scheme_name: string
          scheme_type: string | null
          state_id: string | null
          updated_at: string
        }
        Insert: {
          application_deadline?: string | null
          budget_allocation?: number | null
          contact_number?: string | null
          created_at?: string
          district_id?: string | null
          eligibility_criteria?: string | null
          id?: string
          is_active?: boolean | null
          official_link?: string | null
          scheme_name: string
          scheme_type?: string | null
          state_id?: string | null
          updated_at?: string
        }
        Update: {
          application_deadline?: string | null
          budget_allocation?: number | null
          contact_number?: string | null
          created_at?: string
          district_id?: string | null
          eligibility_criteria?: string | null
          id?: string
          is_active?: boolean | null
          official_link?: string | null
          scheme_name?: string
          scheme_type?: string | null
          state_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "groundwater_schemes_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groundwater_schemes_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base: {
        Row: {
          category: string
          content: string
          created_at: string
          district_id: string | null
          id: string
          language: string | null
          search_vector: unknown | null
          source_document: string
          source_url: string | null
          state_id: string | null
          subcategory: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          district_id?: string | null
          id?: string
          language?: string | null
          search_vector?: unknown | null
          source_document: string
          source_url?: string | null
          state_id?: string | null
          subcategory?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          district_id?: string | null
          id?: string
          language?: string | null
          search_vector?: unknown | null
          source_document?: string
          source_url?: string | null
          state_id?: string | null
          subcategory?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      states: {
        Row: {
          code: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_documents: {
        Row: {
          ai_summary: string | null
          category: string | null
          created_at: string
          description: string | null
          extracted_text: string | null
          file_name: string
          file_path: string
          file_size: number
          id: string
          is_local_only: boolean | null
          location: string | null
          mime_type: string
          original_name: string
          tags: string[] | null
          title: string | null
          updated_at: string
          upload_date: string
          user_id: string
        }
        Insert: {
          ai_summary?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          extracted_text?: string | null
          file_name: string
          file_path: string
          file_size: number
          id?: string
          is_local_only?: boolean | null
          location?: string | null
          mime_type: string
          original_name: string
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          upload_date?: string
          user_id: string
        }
        Update: {
          ai_summary?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          extracted_text?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          is_local_only?: boolean | null
          location?: string | null
          mime_type?: string
          original_name?: string
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          upload_date?: string
          user_id?: string
        }
        Relationships: []
      }
      water_quality_parameters: {
        Row: {
          assessment_id: string
          created_at: string
          id: string
          is_within_limits: boolean | null
          parameter_name: string
          parameter_value: number | null
          unit: string | null
        }
        Insert: {
          assessment_id: string
          created_at?: string
          id?: string
          is_within_limits?: boolean | null
          parameter_name: string
          parameter_value?: number | null
          unit?: string | null
        }
        Update: {
          assessment_id?: string
          created_at?: string
          id?: string
          is_within_limits?: boolean | null
          parameter_name?: string
          parameter_value?: number | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "water_quality_parameters_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "groundwater_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      water_resources_insights: {
        Row: {
          assessment_year: string
          created_at: string
          data_source: string
          district_id: string | null
          id: string
          insight_type: string
          location_name: string
          location_type: string
          metric_name: string
          metric_unit: string | null
          metric_value: number | null
          recommendations: string | null
          state_id: string | null
          status_category: string | null
          updated_at: string
        }
        Insert: {
          assessment_year?: string
          created_at?: string
          data_source: string
          district_id?: string | null
          id?: string
          insight_type: string
          location_name: string
          location_type: string
          metric_name: string
          metric_unit?: string | null
          metric_value?: number | null
          recommendations?: string | null
          state_id?: string | null
          status_category?: string | null
          updated_at?: string
        }
        Update: {
          assessment_year?: string
          created_at?: string
          data_source?: string
          district_id?: string | null
          id?: string
          insight_type?: string
          location_name?: string
          location_type?: string
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number | null
          recommendations?: string | null
          state_id?: string | null
          status_category?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
