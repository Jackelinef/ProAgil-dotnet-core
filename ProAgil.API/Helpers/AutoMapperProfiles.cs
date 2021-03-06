using System.Linq;
using AutoMapper;
using ProAgil.API.Dtos;
using ProAgil.Domain;

namespace ProAgil.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        // construtor
        public AutoMapperProfiles()
        {
            // cria o mapeamento entre os dtos e as classes
            //referenciando n:n
            CreateMap<Evento, EventoDto>()
                 .ForMember(dest => dest.Palestrantes, opt =>
                 {
                     opt.MapFrom(src => src.PalestrantesEventos.Select(x => x.Palestrante).ToList());
                 }).ReverseMap();

            CreateMap<Palestrante, PalestranteDto>()
                 .ForMember(dest => dest.Eventos, opt =>
                 {
                     opt.MapFrom(src => src.PalestrantesEventos.Select(x => x.Evento).ToList());
                 }).ReverseMap();

            CreateMap<Lote, LoteDto>().ReverseMap();

            CreateMap<RedeSocial, RedeSocialDto>().ReverseMap();
        }
    }
}