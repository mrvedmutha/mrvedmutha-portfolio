import { Service } from "@/models/admin/pages/service.model";
import { serviceZodSchema } from "@/schemas/zod/admin/pages/service.zod.schema";
import type {
  ServiceRequest,
  ServiceResponse,
} from "@/types/admin/pages/service.types";
import { dbConnect } from "@/lib/db";

export const serviceService = {
  async create(data: ServiceRequest): Promise<ServiceResponse> {
    await dbConnect();
    // Validate input
    const parsed = serviceZodSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.errors.map((e) => e.message).join(", "));
    }
    // Save to DB
    const service = new Service(parsed.data);
    await service.save();
    return service.toObject();
  },

  async getAll(limit = 25, skip = 0): Promise<ServiceResponse[]> {
    await dbConnect();
    const services = await Service.find({})
      .skip(skip)
      .limit(limit)
      .lean();
    return services as unknown as ServiceResponse[];
  },

  async getById(id: string): Promise<ServiceResponse | null> {
    await dbConnect();
    const service = await Service.findById(id).lean();
    return service ? (service as unknown as ServiceResponse) : null;
  },

  async updateById(
    id: string,
    data: ServiceRequest
  ): Promise<ServiceResponse | null> {
    await dbConnect();
    const parsed = serviceZodSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(parsed.error.errors.map((e) => e.message).join(", "));
    }
    const updated = await Service.findByIdAndUpdate(id, parsed.data, {
      new: true,
    }).lean();
    return updated ? (updated as unknown as ServiceResponse) : null;
  },

  async deleteById(id: string): Promise<void> {
    await dbConnect();
    await Service.findByIdAndDelete(id);
  },
};