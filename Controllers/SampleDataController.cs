using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Dynamic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Test.Controllers
{
    [Route("api/[controller]")]
    public class SampleDataController : Controller
    {
        private readonly IFileProvider _fileProvider;

        public SampleDataController(IFileProvider fileProvider)
        {
            _fileProvider = fileProvider;
        }


        [HttpGet("[action]"), Produces("application/json")]
        public string Categories()
        {
            var categoriesFile = _fileProvider.GetFileInfo(@"./Controllers/data/categories.json");
            return System.IO.File.ReadAllText(categoriesFile.PhysicalPath);
        }

        [HttpGet("[action]")]
        public JsonResult Products(string category)
        {
            var productsFile = _fileProvider.GetFileInfo(@"./Controllers/data/products.json");
            var imagesFile = _fileProvider.GetFileInfo(@"./Controllers/data/images.json");

            string productsJson = System.IO.File.ReadAllText(productsFile.PhysicalPath);
            string imagesJson = System.IO.File.ReadAllText(imagesFile.PhysicalPath);

            var expConverter = new ExpandoObjectConverter();
            var products = JsonConvert.DeserializeObject<List<ExpandoObject>>(productsJson, expConverter);
            var images = JsonConvert.DeserializeObject<Dictionary<string, string[]>>(imagesJson);

            if (category != null) {
                products = products.FindAll(prd => {
                    return ((prd as dynamic).categories).Contains(category);
                });
            }

            return Json(products.Select<dynamic, dynamic>(prd => {
                string[] imgs;

                images.TryGetValue(prd.sku, out imgs);
                prd.images = imgs.Select(img => "/images/product" + img);

                return prd;
            }));
        }
    }
}
