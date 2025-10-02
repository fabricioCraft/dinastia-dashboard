import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { SupabaseService } from '../supabase/supabase.service';

describe('LeadsController', () => {
  let controller: LeadsController;
  let service: LeadsService;

  // Mock do SupabaseService
  const mockSupabaseService = {
    getClient: jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: [
            {
              id: 1,
              name: 'Lead Test 1',
              email: 'test1@example.com',
              phone: '123456789',
            },
            {
              id: 2,
              name: 'Lead Test 2',
              email: 'test2@example.com',
              phone: '987654321',
            },
          ],
          error: null,
        }),
      }),
    }),
  };

  // Mock do ConfigService
  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'SUPABASE_URL') return 'http://localhost:54321';
      if (key === 'SUPABASE_KEY') return 'test-key';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeadsController],
      providers: [
        LeadsService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<LeadsController>(LeadsController);
    service = module.get<LeadsService>(LeadsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of leads from MR_base_leads table', async () => {
      // Act
      const result = await controller.findAll();

      // Assert - Agora deve passar porque temos a integração com Supabase
      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            email: expect.any(String),
          }),
        ])
      );
    });

    it('should call LeadsService.findAll', async () => {
      // Arrange
      const findAllSpy = jest.spyOn(service, 'findAll');

      // Act
      await controller.findAll();

      // Assert
      expect(findAllSpy).toHaveBeenCalled();
    });
  });

  describe('TDD - Teste que deve falhar inicialmente', () => {
    it('should return leads data from Supabase MR_base_leads table', async () => {
      // Act
      const result = await controller.findAll();
      
      // Assert - Agora deve passar porque temos a integração com Supabase
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('email');
    });
  });
});