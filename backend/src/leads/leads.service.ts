import { Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { Lead } from './interfaces/lead.interface';

@Injectable()
export class LeadsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  create(createLeadDto: CreateLeadDto) {
    return 'This action adds a new lead';
  }

  async findAll(): Promise<Lead[]> {
    const supabaseClient = this.supabaseService.getClient();
    
    const { data, error } = await supabaseClient
      .from('MR_base_leads')
      .select('*');

    if (error) {
      throw new Error(`Error fetching leads: ${error.message}`);
    }

    return data || [];
  }

  findOne(id: number) {
    return `This action returns a #${id} lead`;
  }

  update(id: number, updateLeadDto: UpdateLeadDto) {
    return `This action updates a #${id} lead`;
  }

  remove(id: number) {
    return `This action removes a #${id} lead`;
  }
}
