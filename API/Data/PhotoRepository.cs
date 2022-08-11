using AutoMapper.QueryableExtensions;

namespace API.Data
{
    public class PhotoRepository : IPhotoRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public PhotoRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Photo> GetPhotoById(int id)
        {
            return await _context.Photos
                .IgnoreQueryFilters()
                .SingleOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<PhotoForApproval>> GetUnapprovedPhotos()
        {
            return await _context.Photos
                .IgnoreQueryFilters()
                .Where(p => !p.IsApproved)
                .ProjectTo<PhotoForApproval>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public void RemovePhoto(Photo photo)
        {
            _context.Photos.Remove(photo);
        }
    }
}